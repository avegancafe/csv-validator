import React, { useState } from 'react'
import Papa from 'papaparse'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { CrossCircledIcon } from '@radix-ui/react-icons'
import { Label } from '@/components/ui/label'

function App() {
  const [templateHeaders, setTemplateHeaders] = useState([])
  const [validationResult, setValidationResult] = useState(null)

  const handleTemplateUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const headers = result.data[0]
          setTemplateHeaders(headers)
        },
      })
    }
  }

  const handleTestUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const headers = result.data[0]
          validateHeaders(headers)
        },
      })
    }
  }

  const validateHeaders = (headers) => {
    const missingHeaders = templateHeaders.filter(
      (header) => !headers.includes(header)
    )
    if (missingHeaders.length > 0) {
      setValidationResult({
        success: false,
        missingHeaders,
      })
    } else {
      setValidationResult({
        success: true,
      })
    }
  }

  return (
    <div className="App px-20 py-12">
      <Card className="shadow-2xl">
        <CardHeader className="text-5xl w-full text-center">
          CSV Validator
        </CardHeader>
        <CardContent className="flex flex-col w-full justify-center items-center pb-16">
          <div className="max-w-screen-lg w-full mb-12">
            <div className="pt-16">
              <Label className="flex flex-col justify-between gap-2">
                <div className="shrink-0">Upload Template CSV:</div>
                <Input
                  className="w-1/3"
                  type="file"
                  accept=".csv"
                  onChange={handleTemplateUpload}
                />
              </Label>
            </div>
            <div className="pt-8">
              <Label className="flex flex-col justify-between gap-2">
                <div className="shrink-0">Upload Test CSV:</div>
                <Input className="w-1/3" type="file" accept=".csv" onChange={handleTestUpload} />
              </Label>
            </div>
          </div>
          {validationResult && (
            <div className="max-w-screen-lg w-full">
              <div className="text-xl flex pb-6">Validation Result</div>
              {validationResult.success ? (
                'All columns are present.'
              ) : (
                <span className="flex gap-2 items-center">
                  <CrossCircledIcon />
                  Missing columns: {validationResult.missingHeaders.join(', ')}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default App
