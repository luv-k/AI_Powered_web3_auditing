// app/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { CalendarIcon, DollarSign, Users, CreditCard, Activity, Search, TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts"
import axios from "axios";
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
    EyeIcon, 
  } from 'lucide-react';
    
import { pdf } from '@react-pdf/renderer';
import PdfDocument from "../components/PdfDocument"



export default function Dashboard() {
  const [attacks, setAttacks] = useState([]);
  const [githubUrl, setGithubUrl] = useState("");
  const [solidityCode, setSolidityCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [archives, setArchives] = useState([]);
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);



  const [date, setDate] = useState({
    from: new Date(2023, 0, 20), // Jan 20, 2023
    to: new Date(2023, 1, 9),    // Feb 9, 2023
  })

  const chartData = [
    { bugs: "Improper Input Validation", audits: 186 },
    { bugs: "Oracle Manipulation", audits: 305 },
    { bugs: "Replay Attacks", audits: 237 },
    { bugs: "Reentrancy", audits: 273 },
    { bugs: "Frontrunning", audits: 209 },
    { bugs: "Gas Optimization", audits: 214 },
  ]

  useEffect(() => {
    const fetchAttacks = async () => {
      try {
        const response = await axios.get("http://localhost:3000/attacks");
        setAttacks(response.data.slice(0, 30)); // Limit to 5
      } catch (error) {
        console.error("Error fetching attacks:", error);
      }
    };

    fetchAttacks();
  }, []);

  const handleAudit = async (type) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const requestBody = {
        contract_name: "UserSubmittedContract",
        ...(type === "github" ? { github_url: githubUrl } : { solidity_code: solidityCode }),
      };
  
      const response = await axios.post("http://localhost:3000/audit", requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      console.log("Audit Response:", response.data);
      setAuditResult(response.data.audit);
      setShowAuditModal(true); // Show the modal when audit is complete
    } catch (error) {
      console.error("Audit Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };
  


  // Fetch archives in useEffect
useEffect(() => {
    const fetchArchives = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/audits", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArchives(response.data);
      } catch (error) {
        console.error("Error fetching archives:", error);
      }
    };
  
    fetchArchives();
  }, []);
  
  // Function to open archive details
  const openArchiveDetails = (archive) => {
    setSelectedArchive(archive);
    setIsArchiveModalOpen(true);
  };

  
  const handleDownloadReport = async (archive) => {
    const blob = await pdf(<PdfDocument archive={archive} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${archive.contract_name}_audit_report.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };
  


  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {/* Top Navigation Bar */}
      <header className="border-b bg-white">
        <div className="flex h-16 items-center px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-gray-800">
              <span className="text-xs font-medium text-white">AK</span>
            </Avatar>
            <span className="font-medium">Alicia Koch</span>
          </div>
          <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
            <Button variant="ghost" className="font-medium">Overview</Button>
            <Button variant="ghost" className="text-muted-foreground">Customers</Button>
            <Button variant="ghost" className="text-muted-foreground">Products</Button>
            <Button variant="ghost" className="text-muted-foreground">Settings</Button>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-[200px] sm:w-[300px] pl-8"
              />
            </div>
            <Avatar className="h-8 w-8">
              <span className="sr-only">User menu</span>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 space-y-4 p-4 md:p-8 bg-white">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-2">
            {/* <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex h-10 gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {format(date.from, "MMM dd, yyyy")} - {format(date.to, "MMM dd, yyyy")}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultbugs={date.from}
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                />
              </PopoverContent>
            </Popover> */}
            <Button>Download</Button>
          </div>
        </div>

        {/* Tabs with local gray background */}
        <div>
          <Tabs defaultValue="overview" className="space-y-4">
            <div className="inline-flex rounded-md bg-gray-50 p-1">
              <TabsList className="bg-transparent">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="audit">Audit</TabsTrigger>
                <TabsTrigger value="archive">Archive</TabsTrigger>
                <TabsTrigger value="POC">Poc-Gen</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="overview" className="space-y-4">
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">10</div>
                    <p className="text-xs text-muted-foreground">Total Contracts Audited</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Credits</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">10000</div>
                    <p className="text-xs text-muted-foreground">Total Audit Credits</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Gas Optimization</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">Total Gas Optimized (ETH/USD)</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-muted-foreground">Ongoing Audits</p>
                  </CardContent>
                </Card>
              </div>

              {/* Radar Chart and Recent Sales */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 lg:col-span-3">
                  <Card className="w-full">
                    <CardHeader className="items-center text-center pb-2">
                      <CardTitle>Vulnerability Chart</CardTitle>
                      <CardDescription>
                        Top 6 Vulnerability from OWASP
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-2">
                      <div className="mx-auto h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={chartData} outerRadius="80%">
                            <PolarGrid />
                            <PolarAngleAxis dataKey="bugs" />
                            <Tooltip />
                            <Radar
                              name="audits"
                              dataKey="audits"
                              stroke="rgba(0, 0, 0, 0.7)"
                              fill="rgba(0, 0, 0, 0.3)"
                              fillOpacity={0.6}
                              dot={{ r: 4, fillOpacity: 1, fill: "rgba(0, 0, 0, 0.7)" }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 text-sm pt-2 pb-4">
                      <div className="flex items-center gap-2 font-medium leading-none">
                        Most Detected Vulnerabilities<TrendingUp className="h-4 w-4" />
                      </div>
                      <div className="flex items-center gap-2 leading-none text-muted-foreground">
                        All Time Audit
                      </div>
                    </CardFooter>
                  </Card>
                </div>
                <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>New & Emerging Vulnerabilities</CardTitle>
                    <p className="text-sm text-muted-foreground">
                    Live feed of new attack techniques being used in smart contracts.
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                    {attacks.length > 0 ? (
                        attacks.map((attack, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10" />
                            <div>
                                <p className="text-sm font-medium">{attack.technique}</p>
                                <p className="text-xs text-muted-foreground">{attack.source}</p>
                            </div>
                            </div>
                            <div className="font-medium text-black-500">
                            ${attack.amount.toLocaleString()}
                            </div>
                        </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No attack data available.</p>
                    )}
                    </div>
                </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="audit" className="space-y-4">
                <Card>
                    <CardHeader>
                    <CardTitle>Submit Contract for Audit</CardTitle>
                    <CardDescription>
                        Enter a GitHub URL or paste your smart contract code directly
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    {/* GitHub URL input with button */}
                    <div className="flex gap-2 items-start">
                        <Textarea 
                        className="flex-1" 
                        placeholder="GITHUB URL" 
                        rows={2}
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        />
                         <Button className="mt-1" onClick={() => handleAudit("github")} disabled={loading}>
                          {loading ? "Auditing..." : "Audit"}
                         </Button>
                    </div>
                    
                    {/* Code paste area */}
                    <div className="grid w-full gap-2">
                        <Textarea 
                        placeholder="PASTE YOUR CODE" 
                        className="min-h-[200px]"
                        value={solidityCode}
                        onChange={(e) => setSolidityCode(e.target.value)}
                        />
                        <Button onClick={() => handleAudit("code")} disabled={loading}>
                          {loading ? "Auditing..." : "Audit Code"}
                        </Button>
                    </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Audit Results Modal */}
            <Dialog open={showAuditModal} onOpenChange={setShowAuditModal}>
            <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                <DialogTitle className="text-xl font-bold">Smart Contract Audit Results</DialogTitle>
                <DialogDescription>
                    Analysis and recommendations for your contract
                </DialogDescription>
                </DialogHeader>
                
                    {auditResult && (
                            <div className="space-y-4">
                                <div>
                                <h3 className="font-semibold text-lg">Contract Name</h3>
                                <p>{auditResult.contract_name}</p>
                                </div>
                                
                                <div>
                                <h3 className="font-semibold text-lg">Audit Results</h3>
                                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                                    <ReactMarkdown 
                                    components={{
                                        code({node, inline, className, children, ...props}) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        return !inline && match ? (
                                            <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                            >
                                            {String(children).replace(/\n$/, '')}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <code className={className} {...props}>
                                            {children}
                                            </code>
                                        );
                                        }
                                    }}
                                    >
                                    {auditResult.audit_result}
                                    </ReactMarkdown>
                                </div>
                                </div>
                                
                                {auditResult.patched_code && (
                                <div>
                                    <h3 className="font-semibold text-lg">Patched Code</h3>
                                    <div className="bg-muted p-4 rounded-md overflow-x-auto">
                                    <SyntaxHighlighter 
                                        language="solidity" 
                                        style={vscDarkPlus}
                                    >
                                        {auditResult.patched_code}
                                    </SyntaxHighlighter>
                                    </div>
                                </div>
                                )}
                                
                                <div className="pt-4">
                                <p className="text-sm text-muted-foreground">
                                    Audit completed at: {new Date(auditResult.created_at).toLocaleString()}
                                </p>
                                </div>
                            </div>

                )}
            </DialogContent>
            </Dialog>

            <TabsContent value="archive" className="space-y-4">
                <Card>
                    <CardHeader>
                    <CardTitle>Audit Archives</CardTitle>
                    <CardDescription>
                        View your past smart contract audits
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <div className="space-y-2">
                        {archives.length > 0 ? (
                        archives.map((archive) => (
                            <div 
                            key={archive.id} 
                            className="flex justify-between items-center border-b py-2 hover:bg-gray-50 transition-colors"
                            >
                            <div>
                                <p className="font-medium">{archive.contract_name}</p>
                                <p className="text-xs text-muted-foreground">
                                Audited on: {new Date(archive.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => openArchiveDetails(archive)}
                            >
                                <EyeIcon className="h-4 w-4" />
                            </Button>
                            </div>
                        ))
                        ) : (
                        <p className="text-center text-muted-foreground">
                            No past audits found.
                        </p>
                        )}
                    </div>
                    </CardContent>
                </Card>
            </TabsContent>

        <Dialog open={isArchiveModalOpen} onOpenChange={setIsArchiveModalOpen}>
            <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                    Archive Details: {selectedArchive?.contract_name}
                </DialogTitle>
                <DialogDescription>
                    Detailed audit report for your smart contract
                </DialogDescription>
                </DialogHeader>
                
                {selectedArchive && (
                <div className="space-y-4">
                    <div>
                    <h3 className="font-semibold text-lg">Contract Name</h3>
                    <p>{selectedArchive.contract_name}</p>
                    </div>
                    
                    <div>
                    <h3 className="font-semibold text-lg">Audit Results</h3>
                    <div className="bg-muted p-4 rounded-md overflow-x-auto">
                        <ReactMarkdown 
                        components={{
                            code({node, inline, className, children, ...props}) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                                <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                                >
                                {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={className} {...props}>
                                {children}
                                </code>
                            );
                            }
                        }}
                        >
                        {typeof selectedArchive.audit_result === 'string' 
                            ? selectedArchive.audit_result 
                            : JSON.stringify(selectedArchive.audit_result, null, 2)}
                        </ReactMarkdown>
                    </div>
                    </div>
                    
                    {selectedArchive.patched_code && (
                    <div>
                        <h3 className="font-semibold text-lg">Patched Code</h3>
                        <div className="bg-muted p-4 rounded-md overflow-x-auto">
                        <SyntaxHighlighter 
                            language="solidity" 
                            style={vscDarkPlus}
                        >
                            {selectedArchive.patched_code}
                        </SyntaxHighlighter>
                        </div>
                    </div>
                    )}
                    
                    <div className="pt-4 flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        Audit completed at: {new Date(selectedArchive.created_at).toLocaleString()}
                    </p>
                    <Button 
                        variant="outline"
                        onClick={() => {
                        // Optional: Add download functionality
                        // You can use the PDF download logic from previous suggestions
                            handleDownloadReport(selectedArchive)
                        }}
                    >
                        Download Report
                    </Button>
                    </div>
                </div>
                )}
            </DialogContent>
        </Dialog>




          </Tabs>
        </div>
      </main>
    </div>
  )
}