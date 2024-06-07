import React, { useState, useEffect } from 'react'
import Papa from 'papaparse'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar'
import { CrossCircledIcon, CheckCircledIcon } from '@radix-ui/react-icons'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'

function App() {
  const [templateHeaders, setTemplateHeaders] = useState([])
  const [validationResult, setValidationResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progressValue, setProgressValue] = useState(0)
  useEffect(() => {
    Papa.parse('/csv-validator/marketability-template.csv', {
      download: true,
      complete: (result) => {
        const headers = result.data[0]
        setTemplateHeaders(headers)
      },
    })
  }, [])

  const randomize = (approximate) => (0.6 + Math.random() * 0.4) * approximate

  const handleTestUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setProgressValue(0)
      setLoading(true)
      setTimeout(
        () => setProgressValue((x) => x + randomize(5)),
        randomize(300)
      )
      setTimeout(() => {
        setProgressValue((x) => x + randomize(27))
        Papa.parse(file, {
          complete: (result) => {
            const headers = result.data[0]
            setProgressValue((x) => x + randomize(50))
            validateHeaders(headers)
            setTimeout(() => {
              setLoading(false)
            }, randomize(1200))
          },
          error: () => {
            setLoading(false)
          },
        })
      }, randomize(1000))
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
    <>
      <Menubar className="bg-white mx-4 my-3">
        <MenubarMenu>
          <MenubarTrigger disabled>CSV Validator</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
      <div className="App px-20 py-12">
        <Card className="shadow-2xl items-center">
          <CardDescription className="text-lg pl-24 pt-8">
            Hello! Please upload a CSV file to validate it against the template.
            Once you upload the file, we will check if all the columns are
            present.
          </CardDescription>
          <CardContent className="flex flex-col w-full justify-center items-center pb-16">
            <div className="max-w-screen-lg w-full mb-12">
              <div className="pt-8">
                <Label className="flex flex-col justify-between gap-2">
                  <div className="shrink-0">Test CSV:</div>
                  <Input
                    disabled={!templateHeaders?.length}
                    className="w-1/3"
                    type="file"
                    accept=".csv"
                    onChange={handleTestUpload}
                  />
                </Label>
              </div>
            </div>
            {loading ? (
              <Progress className="w-1/2" value={progressValue} />
            ) : (
              <div className="max-w-screen-lg w-full">
                {validationResult && (
                  <>
                    <div className="text-xl flex pb-6">Validation Result</div>
                    {validationResult.success ? (
                      <span className="flex gap-2 items-center">
                        <CheckCircledIcon className="text-green-500 size-6" />
                        All columns are present!
                      </span>
                    ) : (
                      <span className="flex gap-2 items-center">
                        <CrossCircledIcon className="text-red-500 size-6" />
                        Missing columns:{' '}
                        {validationResult.missingHeaders.join(', ')}
                      </span>
                    )}
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default App
