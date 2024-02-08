import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import PDFParser from 'pdf2json'; // To parse the pdf

/* ------------------------------------------------------------------

BUG: if the script uploaded is not clean.. if it's sort of messy, and 
requires OCR , this PDF parser will not parse it. It won't recognize it 
and instead will return EMPTY. 

This can prove to be a big bug because we don't have control over the 
documents that the user is uploading. It can range from a large variety
proving to be a pretty big blocker.

------------------------------------------------------------------- */


export async function POST( request: NextRequest ) {
    const data = await request.formData();
    const uploadedFile: File | null = data.get('file') as unknown as File;

    if (!uploadedFile) {
        return NextResponse.json({ success: false });
    } 

    try {
        // Your asynchronous operation, such as fetching data from an API
        const data = await parsePDF(uploadedFile);
    
        // Once the promise is fulfilled, send the response
        return NextResponse.json({ message: data });
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' });
      }
}

const parsePDF = async (file: File) => {
    let fileName = '';
    let parsedText = '';

    if (file) {
        // console.log('Uploaded File: ', file);
    
        // convert the uploaded file into a temporary file
        const temp = `/tmp/${fileName}.pdf`;
    
        // Convert arrayBuffer to Buffer
        const fileBuffer = Buffer.from(await file.arrayBuffer());
    
        // save the buffer as a file
        await writeFile(temp, fileBuffer);
    
        // @ts-ignore
        const pdfParser = new (PDFParser as any)(null, 1);
    
        pdfParser.on('pdfParser_dataError', (errData: any) => {
            console.log(errData.parserError);
        });
    
        pdfParser.on('pdfParser_dataReady', () => {
            parsedText = (pdfParser as any).getRawTextContent();
        });
    
        pdfParser.loadPDF(temp);
    }

    return new Promise((resolve) => {
        setTimeout(() => {
          resolve(parsedText);
        }, 2000); 
      });
}