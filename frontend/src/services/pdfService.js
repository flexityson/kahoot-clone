import api from './api'

export const pdfService = {
  uploadPDF: async (file, questionCount) => {
    const formData = new FormData()
    formData.append('pdf', file)
    formData.append('questionCount', questionCount)

    const { data } = await api.post('/pdf/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return data.quiz
  }
}