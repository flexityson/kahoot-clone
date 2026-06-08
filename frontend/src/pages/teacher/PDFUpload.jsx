import { useDropzone } from 'react-dropzone'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { pdfService } from '../../services/pdfService'
import Button from '../../components/shared/Button'
import toast from 'react-hot-toast'

export default function PDFUpload() {
  const [file, setFile] = useState(null)
  const [questionCount, setQuestionCount] = useState(10)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0])
    }
  })

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    try {
      const quiz = await pdfService.uploadPDF(file, questionCount)
      toast.success('Quiz generated!')
      navigate(`/teacher/edit/${quiz.id}`)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to generate quiz')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">📄 AI Quiz Generator</h1>
          <Button variant="outline" onClick={() => navigate('/teacher')}>Back</Button>
        </div>
      </nav>

      <main className="max-w-xl mx-auto p-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition
            ${isDragActive ? 'border-purple-600 bg-purple-50' : 'border-gray-300 hover:border-purple-400'}`}
        >
          <input {...getInputProps()} />
          {file ? (
            <p className="text-green-600 font-semibold text-lg">✅ {file.name}</p>
          ) : (
            <>
              <p className="text-4xl mb-4">📁</p>
              <p className="text-gray-600">
                {isDragActive ? 'Drop PDF here' : 'Drag & drop PDF here, or click to select'}
              </p>
            </>
          )}
        </div>

        {file && (
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">
              Number of questions: {questionCount}
            </label>
            <input
              type="range"
              min="5"
              max="20"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5</span>
              <span>20</span>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center mt-6">
            <p className="text-gray-600">🤖 AI is reading your PDF and creating questions...</p>
            <p className="text-sm text-gray-500">This takes 10-30 seconds</p>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full mt-6"
        >
          {loading ? '✨ Generating Quiz...' : '✨ Generate Quiz'}
        </Button>
      </main>
    </div>
  )
}