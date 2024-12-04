"use client"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import dynamic from 'next/dynamic'
import mermaid from 'mermaid'
import { cn } from '@/lib/utils'
import { themes, presets, presetDiagrams } from '@/types/mock'
import { useEffect, useRef, useState } from 'react';
import type { Diagram, MermaidThemes } from '@/types/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
// import Chat from '@/components/edit/chat'
import { Save, Upload } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { fetchClient } from '@/lib/fetchClient'
import { useAuth } from '@clerk/nextjs'

const CodeEditor = dynamic(
  () => import('@uiw/react-textarea-code-editor').then((mod) => mod.default),
  { ssr: false }
);

type DiagramPageProps = {
  id: string
}

export default function DiagramPageClient({ id }: DiagramPageProps) {
  const [code, setCode] = useState('');
  const [theme, setTheme] = useState<MermaidThemes>('default');
  const [svgCode, setSvgCode] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const previewRef = useRef<HTMLDivElement>(null)

  // const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const [transformOrigin, setTransformOrigin] = useState({ x: '50%', y: '50%' });
  const [zoomLevel, setZoomLevel] = useState(1);
  // const [blockInput, setBlockInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const handleZoom = (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();

      const rect = previewRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Calculate cursor position relative to the container
      const cursorX = e.clientX - rect.left; // Cursor X relative to the container
      const cursorY = e.clientY - rect.top; // Cursor Y relative to the container

      // Calculate percentage position for transform-origin
      const xPercent = (cursorX / rect.width) * 100;
      const yPercent = (cursorY / rect.height) * 100;

      // Update transform-origin dynamically
      setTransformOrigin({ x: `${xPercent}%`, y: `${yPercent}%` });

      // Adjust zoom level
      setZoomLevel((prevZoom) => {
        const newZoom = Math.min(Math.max(prevZoom - e.deltaY * 0.001, 0.5), 2);
        return newZoom;
      });
    }
  };

  const loadDiagram = async () => {
    try {
      const token = await getToken();
      if (!token) {
        return;
      }
      const response = await fetchClient<Diagram>(`/api/diagrams/${id}`, token, 'GET');
      setCode(response.mermaid_code);
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (id) {
      loadDiagram()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    const previewElement = previewRef.current;
    if (previewElement) {
      previewElement.addEventListener('wheel', handleZoom, { passive: false });
    }
    return () => {
      if (previewElement) {
        previewElement.removeEventListener('wheel', handleZoom);
      }
    };
  }, []);


  useEffect(() => {
    const handler = setTimeout(() => {
      if (code.length > 0) {
        mermaid.initialize({ theme });
        renderMermaid();
      }
    }, 500); // Adjust the debounce delay as needed

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, theme]);

  const renderMermaid = async () => {
    if (previewRef.current) {
      try {
        mermaid.parse(code)
        const { svg } = await mermaid.render('preview', code)
        previewRef.current.innerHTML = svg
        setSvgCode(svg)
        setError(null)
      } catch (error) {
        console.error(error)
        setError('Invalid Mermaid code')
      }
    }
  }

  const setThemeWrapper = (themeString: string) => {
    const theme = themeString as MermaidThemes
    setTheme(theme)
  };

  const handleExport = (format: 'png' | 'svg') => {
    if (format === 'svg') {
      const blob = new Blob([svgCode], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'mermaid-diagram.svg'
      a.click()
    } else if (format === 'png') {
      const svg = previewRef.current?.querySelector('svg')
      if (svg) {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx?.drawImage(img, 0, 0)
          const pngUrl = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = pngUrl
          a.download = 'mermaid-diagram.png'
          a.click()
        }
        img.src = 'data:image/svg+xml;base64,' + btoa(svgCode)
      }
    }
  };

  const setPreset = (preset: string) => {
    const code = presetDiagrams[preset]
    setCode(code)
  };

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth < 768);

    const disablePageZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // Run on mount
    updateIsMobile();

    window.addEventListener('wheel', disablePageZoom, { passive: false });

    // Add event listener
    window.addEventListener('resize', updateIsMobile);

    // Cleanup
    return () => {
      window.removeEventListener('wheel', disablePageZoom);
      window.removeEventListener('resize', updateIsMobile);
    }
  }, []);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (!e.target) return
        if (typeof e.target.result === 'string') {
          setCode(e.target.result);
        }
      }
      reader.readAsText(file)
    }
  }

  // const handleSendMessage = async (message: string) => {
  //   setChatMessages([...chatMessages, { message, my: false }])
  //   try {
  //     const token = await getToken();
  //     if (!token) {
  //       return;
  //     }
  //     setBlockInput(true)
  //     const response = await fetchClient<string>('api/ai', token, 'POST', { prompt: message, diagram: code });
  //     setChatMessages([...chatMessages, { message: response, my: false }])
  //     setBlockInput(false)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  const handleSave = async () => {
    try {
      const token = await getToken();
      if (!token) {
        return;
      }
      const response = await fetchClient(`api/diagrams/${id}`, token, 'PATCH', { code });
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {error && (
        <div className='mx-auto py-2 w-full max-w-md'>
          <Alert className="" variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      <main className={cn('flex items-center justify-center w-full h-full')}>
        <ResizablePanelGroup
          direction={isMobile ? 'vertical' : 'horizontal'}
          className="max-w-[90dvw] rounded-lg border md:min-w-[450px] min-h-[80dvh]"
        >
          <ResizablePanel defaultSize={600} minSize={45}>
            <div className="h-full flex flex-col items-center">
              <div className="flex flex-col items-center justify-center w-full p-4">
                <h2 className="text-xl font-semibold text-center">Code</h2>
              </div>

              <div className={cn("grid px-4 grid-cols-1 sm:grid-cols-2 gap-4 items-center justify-center")}>
                <Select onValueChange={setThemeWrapper}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={setPreset}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select preset" />
                  </SelectTrigger>
                  <SelectContent>
                    {presets.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImport}
                  accept=".txt,.md"
                  className="hidden"
                />

                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>

              <div className="flex-1 overflow-auto w-full mt-4">
                <CodeEditor
                  value={code}
                  language="mermaid"
                  onChange={(evn) => setCode(evn.target.value)}
                  padding={15}
                  style={{
                    fontSize: 13,
                    backgroundColor: 'transparent',
                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                    height: '100%',
                  }}
                />
              </div>
              {/* <div className="flex-1 overflow-auto w-full p-4">
                <Chat messages={chatMessages} onMessageSend={handleSendMessage} blockInput={blockInput} />
              </div> */}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={500} minSize={45}>
            <div className="h-full flex flex-col">
              <div className="flex flex-col items-center justify-center w-full p-4">
                <h2 className="text-xl font-semibold text-center">Preview</h2>
              </div>
              <div ref={previewRef} className="flex-1 border p-4 overflow-auto min-h-[200px]"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: `${transformOrigin.x} ${transformOrigin.y}`,
                }}
              ></div>
              <div className="flex space-x-4 items-center justify-center p-4 z-10">
                <Button onClick={() => handleExport('png')}>Export PNG</Button>
                <Button onClick={() => handleExport('svg')}>Export SVG</Button>
                {(zoomLevel > 1 || zoomLevel < 1) && (
                  <Button onClick={() => setZoomLevel(1)}>Reset Zoom</Button>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </>
  )
}
