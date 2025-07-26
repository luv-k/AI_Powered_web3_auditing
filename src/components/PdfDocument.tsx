import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer';
import ReactMarkdown from 'react-markdown';

import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Load fonts from reliable sources
Font.register({
    family: 'Roboto',
    fonts: [
      {
        src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu72xKOzY.woff2',
        fontWeight: 400,
      },
      {
        src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmSU5vAx05IsDqlA.woff2',
        fontWeight: 700,
      },
    ],
  });
  
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    },
  section: {
    marginBottom: 20,
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  codeBlock: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 4,
    fontFamily: 'Courier',
    fontSize: 10,
    marginVertical: 8,
  },
  inlineCode: {
    backgroundColor: '#f5f5f5',
    padding: '2px 4px',
    borderRadius: 4,
    fontFamily: 'Courier',
    fontSize: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bulletPoint: {
    width: 20,
    paddingRight: 5,
  },
});

const MarkdownComponents = {
  h1: ({ children }) => <Text style={styles.heading1}>{children}</Text>,
  h2: ({ children }) => <Text style={styles.heading2}>{children}</Text>,
  code: ({ inline, children }) => (
    <Text style={inline ? styles.inlineCode : styles.codeBlock}>
      {children}
    </Text>
  ),
  ul: ({ children }) => <View style={styles.section}>{children}</View>,
  li: ({ children }) => (
    <View style={styles.listItem}>
      <Text style={styles.bulletPoint}>•</Text>
      <Text>{children}</Text>
    </View>
  ),
  p: ({ children }) => <Text style={{ marginBottom: 8 }}>{children}</Text>,
  strong: ({ children }) => <Text style={{ fontWeight: 700 }}>{children}</Text>,
};

const PdfDocument = ({ archive }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading1}>{archive.contract_name} Audit Report</Text>
          <Text>Audit Date: {new Date(archive.created_at).toLocaleString()}</Text>
        </View>
  
        <View style={styles.section}>
          <Text style={styles.heading2}>Audit Results</Text>
          <ReactMarkdown components={MarkdownComponents}>
            {typeof archive.audit_result === 'string' 
              ? archive.audit_result 
              : JSON.stringify(archive.audit_result, null, 2)}
          </ReactMarkdown>
        </View>
  
        {archive.patched_code && (
          <View style={styles.section}>
            <Text style={styles.heading2}>Patched Code</Text>
            <Text style={styles.codeBlock}>{archive.patched_code}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
  
export default PdfDocument;
  