"use client"

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { extractInvoiceData, ExtractedInvoiceData } from '@/ai/flows/extract-invoice-data'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [extractedData, setExtractedData] = useState<ExtractedInvoiceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const onDrop = (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      handleProcess(uploadedFile);
    }
  }
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxFiles: 1,
  })

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleProcess = async (uploadedFile: File) => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    setError(null);
    setExtractedData(null);

    try {
      const invoiceDocumentUri = await fileToDataUri(uploadedFile);
      const data = await extractInvoiceData({ invoiceDocumentUri });
      setExtractedData(data);
    } catch (err) {
      console.error("Error extracting invoice data:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Processing Failed",
        description: "Could not extract data from the invoice. Please try a different file.",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  const handleMint = async () => {
    if (!extractedData) return;
    setIsMinting(true);
    try {
      // In a real app, you'd collect the potentially edited data from the form fields.
      // For this simulation, we'll use the state data.
      const response = await fetch('/api/invoices/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(extractedData),
      });

      if (!response.ok) {
        throw new Error('Minting failed. Please try again.');
      }

      const newInvoice = await response.json();
      toast({
        title: "Success!",
        description: `Invoice NFT ${newInvoice.invoiceNumber} minted and listed on the marketplace.`,
      });
      router.push('/marketplace');

    } catch (err) {
       const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
       toast({
        variant: "destructive",
        title: "Minting Failed",
        description: errorMessage,
      });
    } finally {
      setIsMinting(false);
    }
  }

  const resetState = () => {
    setFile(null);
    setIsProcessing(false);
    setExtractedData(null);
    setError(null);
  }
  
  const isProcessed = extractedData !== null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Invoice</h1>
        <p className="text-muted-foreground">Upload an invoice to tokenize it on the blockchain.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          {!isProcessed && !error ? (
            <div {...getRootProps()} className={`relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors ${isDragActive ? 'border-primary bg-primary/10' : ''}`}>
              <input {...getInputProps()} />
              {file && !isProcessing ? (
                <div className="text-center">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 font-semibold">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{Math.round(file.size / 1024)} KB</p>
                </div>
              ) : isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="mt-4 text-muted-foreground">Extracting data from invoice...</p>
                </>
              ) : (
                <>
                  <UploadCloud className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 font-semibold">Drag & drop your invoice here, or click to select a file</p>
                  <p className="text-sm text-muted-foreground">PDF, PNG, JPG supported</p>
                </>
              )}
            </div>
          ) : error ? (
            <div className="text-center p-12 text-destructive">
                <AlertTriangle className="mx-auto h-12 w-12" />
                <p className="mt-4 font-semibold">An Error Occurred</p>
                <p className="text-sm">{error}</p>
                 <Button variant="outline" onClick={resetState} className="mt-4">Try Again</Button>
            </div>
          ) : (
             <div className="text-center p-12">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <p className="mt-4 font-semibold">Invoice Processed Successfully!</p>
                <p className="text-sm text-muted-foreground">Please verify the extracted data below.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {isProcessed && (
        <Card>
          <CardHeader>
            <CardTitle>Verify Invoice Data</CardTitle>
            <CardDescription>Confirm the auto-filled details are correct before minting the NFT.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issuer">Issuer Name</Label>
                <Input id="issuer" defaultValue={extractedData.issuerName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="debtor">Debtor Name</Label>
                <Input id="debtor" defaultValue={extractedData.debtorName} />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoice-number">Invoice Number</Label>
                <Input id="invoice-number" defaultValue={extractedData.invoiceNumber} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Invoice Amount</Label>
                <Input id="amount" type="number" defaultValue={extractedData.amount} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Input id="due-date" type="date" defaultValue={extractedData.dueDate} />
              </div>
            </div>
          </CardContent>
          <div className="flex justify-end p-6 pt-0 gap-2">
             <Button variant="outline" onClick={resetState} disabled={isMinting}>Upload Another</Button>
             <Button onClick={handleMint} disabled={isMinting}>
                {isMinting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Mint Invoice NFT
             </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
