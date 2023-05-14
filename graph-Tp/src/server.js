import express from "express"
import { graphqlHTTP } from "express-graphql"
import { buildSchema } from "graphql"
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs";
const prisma = new PrismaClient()
const app = express()
//allow to accept json in body
app.use(express.json())


let schema = buildSchema(`
    type Lesson {
        idlesson: Int!
        name: String!
        teacher: Teacher!
        mark: [Mark!]!
    }
    type Mark {
        idmark: Int!
        result: Float!
        lesson: Lesson!
        student: Student!
      }
      
      type Student {
        idstudent: Int!
        ine: String
        mark: [Mark!]!
        user: User!
      }
      
      type Teacher {
        idteacher: Int!
        lesson: [Lesson!]!
        user: User!
      }
      type User {
        iduser: ID!
        lastname: String!
        firstname: String!
        email: String!
        password: String!
        role: Role!
        student: [Student!]!
      }  
      type Role {
        idrole: ID!
        name: String!
      } 
      
      type Query {
        getAllStudent: [Student]
        getAllUser: [User]
        getAllTeacher: [Teacher]
        getAllLesson: [Lesson]
        getAllMark: [Mark]
    }
    input userInput{
        lastname: String!
        firstname: String!
        email: String!
        password: String!
        idrole: Int!
    }
    input studentInput{
        ine: String!
        iduser: Int!
    }
    input teacherInput{
        iduser: Int!
    }
    input lessonInput{
        name: String!
        idteacher: Int!
    }
    input markInput{
        result: Float!
        idlesson: Int!
        idstudent: Int!
    }
    input updateUserInput{
        lastname: String
        firstname: String
        password: String
        iduser: Int!
    }
    input updateStudentInput{
        ine: String!
        idstudent: Int!
    }
    input updateTeacherInput{
        idteacher: Int!
    }
    input updateLessonInput{
        name: String!
        idlesson: Int!
    }
    input updateMarkInput{
        result: Float!
        idmark: Int!
    }
    type Mutation {
        insertUser(value: userInput): User
        insertStudent(value: studentInput): Student
        insertTeacher(value: teacherInput): Teacher
        insertLesson(value: lessonInput): Lesson
        insertMark(value: markInput): Mark
        updateUser(value: updateUserInput): User
        updateStudent(value: updateStudentInput): Student
        updateTeacher(value: updateTeacherInput): Teacher
        updateLesson(value: updateLessonInput): Lesson
        updateMark(value: updateMarkInput): Mark
        deleteMark(id: Int): [Mark]
        deleteLesson(id: Int): [Lesson]
        deleteStudent(id: Int): [Student]
        deleteTeacher(id: Int): [Teacher]
    }
  
`)

let root = {
    getAllStudent: async () => {
        return prisma.student.findMany({
            include: {
                user: true
            }
        })
    },
    getAllUser: async () => {
        return prisma.user.findMany({

        })
    },
    getAllTeacher: async () => {
        return prisma.teacher.findMany({
            include: {
                user: true
            }
        })
    },
    getAllLesson: async () => {
        return prisma.lesson.findMany({

        })
    },
    getAllMark: async () => {
        return prisma.mark.findMany({
            include: {
                student: {
                    select: {
                        user: true
                    }
                },
                lesson: true
            }
        })
    },
    insertUser: async ({ value }) => {
        const role = await prisma.role.findUnique({
            where: {
                idrole: value.idrole
            }
        })
        if (role) {
            const salt = await bcrypt.genSalt(10)
            const password = await bcrypt.hash(value.password, salt)
            const userCreate = await prisma.user.create({
                data: {
                    role_idrole: role.idrole,
                    lastname: value.lastname,
                    firstname: value.firstname,
                    email: value.email,
                    password: password
                },
                include: {
                    role: true
                }
            })
            return userCreate
        }

    },
    insertStudent: async ({ value }) => {
        const user = await prisma.user.findUnique({
            where: {
                iduser: value.iduser
            }
        })
        if (user && user.role_idrole == 1) {
            const studentCreate = await prisma.student.create({
                data: {
                    user_iduser: value.iduser,
                    ine: value.ine
                },
                include: {
                    user: true
                }
            })
            return studentCreate
        }
        return null;
    },
    insertTeacher: async ({ value }) => {
        const user = await prisma.user.findUnique({
            where: {
                iduser: value.iduser
            }
        })
        if (user && user.role_idrole == 2) {
            const teacherCreate = await prisma.teacher.create({
                data: {
                    user_iduser: value.iduser,
                },
                include: {
                    user: true
                }
            })
            return teacherCreate
        }
        return null;
    },
    insertLesson: async ({ value }) => {
        const teacher = await prisma.teacher.findUnique({
            where: {
                idteacher: value.idteacher
            }
        })
        if (teacher) {
            const lesson = await prisma.lesson.create({
                data: {
                    teacher_idteacher: value.idteacher,
                    name: value.name
                }
            })
            return lesson
        }
        return null;
    },
    insertMark: async ({ value }) => {
        const student = await prisma.student.findUnique({
            where: {
                idstudent: value.idstudent
            }
        })
        const lesson = await prisma.lesson.findUnique({
            where: {
                idlesson: value.idlesson
            }
        })
        if (student && lesson) {
            const mark = await prisma.mark.create({
                data: {
                    lesson_idlesson: value.idlesson,
                    student_idstudent: value.idstudent,
                    result: value.result
                },
                include: {
                    student: {
                        select: {
                            user: true
                        }
                    },
                    lesson: true
                }
            })
            return mark
        }
        return null;
    },
    updateUser: async ({ value }) => {
        const editor = await prisma.user.update({
            where: {
                iduser: value.iduser,
            },
            data: {
                lastname: value.lastname,
                firstname: value.firstname,
                password: value.password,
            },
        })
        return editor
    },
    updateStudent: async ({ value }) => {
        const update = await prisma.student.update({
            where: {
                idstudent: value.idstudent,
            },
            data: {
                ine: value.ine,
            },
        })
        return update
    },
    updateTeacher: async ({ value }) => {
        const update = await prisma.teacher.update({
            where: {
                idteacher: value.idteacher,
            },
            data: {
            },
        })
        return update
    },
    updateLesson: async ({ value }) => {
        const update = await prisma.lesson.update({
            where: {
                idlesson: value.idlesson,
            },
            data: {
                name: value.name,
            },
        })
        return update
    },
    updateMark: async ({ value }) => {
        const update = await prisma.mark.update({
            where: {
                idmark: value.idmark,
            },
            data: {
                result: value.result,
            },
        })
        return update
    },
    deleteMark: async ({ id }) => {
        const deleteMark = await prisma.mark.deleteMany({
            where: {
                idmark: id,
            },
        });
        const marks = await prisma.mark.findMany({})
        return marks;
    },
    deleteLesson: async ({ id }) => {
        const marks = await prisma.mark.deleteMany({
            where: {
                lesson_idlesson: id,
            },
        })
        await prisma.lesson.deleteMany({
            where: {
                idlesson: id,
            },
        })
        const lessons = await prisma.lesson.findMany({})
        return lessons;
    },
    deleteStudent: async ({ id }) => {
        const marks = await prisma.mark.deleteMany({
            where: {
                student_idstudent: id,
            },
        })
        await prisma.student.deleteMany({
            where: {
                idstudent: id,
            },
        })
        const students = await prisma.student.findMany({})
        return students;
    },
    deleteTeacher: async ({ id }) => {
        const lessons = await prisma.lesson.deleteMany({
            where: {
                teacher_idteacher: id,
            },
        })
        await prisma.teacher.deleteMany({
            where: {
                idteacher: id,
            },
        })
        const teachers = await prisma.teacher.findMany({})
        return teachers;
    },
}
// router de login pour récupérer un token

app.get('/', (req, res) => {
    res.send('API is running...')
})


app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))


app.listen(3000, () => {
    console.log("API GRAPHQL listening on 3000")
})

