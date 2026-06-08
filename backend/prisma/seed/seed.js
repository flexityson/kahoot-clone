const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...\n')

  const teacherPassword = await bcrypt.hash('teacher123', 10)
  const studentPassword = await bcrypt.hash('student123', 10)

  // Create teacher account
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@kahoot.local' },
    update: {},
    create: {
      name: 'Teacher',
      email: 'teacher@kahoot.local',
      password: teacherPassword,
      role: 'TEACHER'
    }
  })

  console.log('Created teacher account:')
  console.log('  Email: teacher@kahoot.local')
  console.log('  Password: teacher123')
  console.log('  ID:', teacher.id)

  // Create student account
  const student = await prisma.user.upsert({
    where: { email: 'student@kahoot.local' },
    update: {},
    create: {
      name: 'Student',
      email: 'student@kahoot.local',
      password: studentPassword,
      role: 'STUDENT'
    }
  })

  console.log('\nCreated student account:')
  console.log('  Email: student@kahoot.local')
  console.log('  Password: student123')

  // Create sample quiz
  const quiz = await prisma.quiz.create({
    data: {
      title: 'Sample Quiz',
      description: 'A sample quiz to get started',
      teacherId: teacher.id,
      totalQuestions: 3,
      status: 'PUBLISHED',
      source: 'MANUAL',
      questions: {
        create: [
          {
            content: 'What is the capital of France?',
            type: 'MCQ',
            timeLimit: 20,
            points: 1000,
            orderIndex: 0,
            options: {
              create: [
                { content: 'Paris', isCorrect: true, orderIndex: 0, color: '#e74c3c' },
                { content: 'London', isCorrect: false, orderIndex: 1, color: '#3498db' },
                { content: 'Berlin', isCorrect: false, orderIndex: 2, color: '#f1c40f' },
                { content: 'Madrid', isCorrect: false, orderIndex: 3, color: '#2ecc71' }
              ]
            }
          },
          {
            content: 'Which planet is known as the Red Planet?',
            type: 'MCQ',
            timeLimit: 20,
            points: 1000,
            orderIndex: 1,
            options: {
              create: [
                { content: 'Venus', isCorrect: false, orderIndex: 0, color: '#e74c3c' },
                { content: 'Mars', isCorrect: true, orderIndex: 1, color: '#3498db' },
                { content: 'Jupiter', isCorrect: false, orderIndex: 2, color: '#f1c40f' },
                { content: 'Saturn', isCorrect: false, orderIndex: 3, color: '#2ecc71' }
              ]
            }
          },
          {
            content: 'What is 2 + 2?',
            type: 'MCQ',
            timeLimit: 20,
            points: 1000,
            orderIndex: 2,
            options: {
              create: [
                { content: '3', isCorrect: false, orderIndex: 0, color: '#e74c3c' },
                { content: '4', isCorrect: true, orderIndex: 1, color: '#3498db' },
                { content: '5', isCorrect: false, orderIndex: 2, color: '#f1c40f' },
                { content: '6', isCorrect: false, orderIndex: 3, color: '#2ecc71' }
              ]
            }
          }
        ]
      }
    },
    include: { questions: { include: { options: true } } }
  })

  console.log('\nCreated sample quiz:')
  console.log('  Title:', quiz.title)
  console.log('  Questions:', quiz.totalQuestions)
  console.log('  ID:', quiz.id)
  console.log('\n✅ Database seeded successfully!\n')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })