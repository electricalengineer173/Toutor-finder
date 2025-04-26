import * as studentsApi from '@/lib/api/students';
import * as teachersApi from '@/lib/api/teachers';

// Cache for user ID to student/teacher ID mappings
const userToStudentMap = new Map<number, number>();
const userToTeacherMap = new Map<number, number>();
const studentToUserMap = new Map<number, number>();
const teacherToUserMap = new Map<number, number>();

/**
 * Initialize the user mapping cache
 */
export const initializeUserMappings = async (): Promise<void> => {
  try {
    console.log('Initializing user mappings...');

    // Fetch all students and teachers
    const [students, teachers] = await Promise.all([
      studentsApi.getAllStudents({ skip: 0, limit: 100 }),
      teachersApi.getAllTeachers({ skip: 0, limit: 100 })
    ]);

    console.log('Fetched data:', {
      students: students.map(s => ({ id: s.id, user_id: s.user_id })),
      teachers: teachers.map(t => ({ id: t.id, user_id: t.user_id }))
    });

    // Clear existing maps
    userToStudentMap.clear();
    userToTeacherMap.clear();
    studentToUserMap.clear();
    teacherToUserMap.clear();

    // Map students
    students.forEach(student => {
      userToStudentMap.set(student.user_id, student.id);
      studentToUserMap.set(student.id, student.user_id);
    });

    // Map teachers
    teachers.forEach(teacher => {
      userToTeacherMap.set(teacher.user_id, teacher.id);
      teacherToUserMap.set(teacher.id, teacher.user_id);
    });

    console.log('Mapping complete. Current maps:', {
      userToStudent: Array.from(userToStudentMap.entries()),
      userToTeacher: Array.from(userToTeacherMap.entries()),
      studentToUser: Array.from(studentToUserMap.entries()),
      teacherToUser: Array.from(teacherToUserMap.entries())
    });

    console.log(`Successfully mapped ${students.length} students and ${teachers.length} teachers`);
  } catch (error) {
    console.error('Error initializing user mappings:', error);
  }
};

/**
 * Get student ID from user ID
 */
export const getStudentIdFromUserId = async (userId: number): Promise<number | null> => {
  console.log(`Looking up student ID for user ID: ${userId}`);

  // Check cache first
  if (userToStudentMap.has(userId)) {
    const studentId = userToStudentMap.get(userId) || null;
    console.log(`Found in cache: User ID ${userId} -> Student ID ${studentId}`);
    return studentId;
  }

  console.log(`User ID ${userId} not found in cache, fetching from API...`);

  // If not in cache, try to fetch all students and update cache
  try {
    const students = await studentsApi.getAllStudents({ skip: 0, limit: 100 });
    console.log(`Fetched ${students.length} students from API`);

    students.forEach(student => {
      userToStudentMap.set(student.user_id, student.id);
      studentToUserMap.set(student.id, student.user_id);
      console.log(`Mapped: User ID ${student.user_id} <-> Student ID ${student.id}`);
    });

    const studentId = userToStudentMap.get(userId) || null;
    console.log(`After API fetch: User ID ${userId} -> Student ID ${studentId}`);
    return studentId;
  } catch (error) {
    console.error('Error getting student ID from user ID:', error);
    return null;
  }
};

/**
 * Get teacher ID from user ID
 */
export const getTeacherIdFromUserId = async (userId: number): Promise<number | null> => {
  console.log(`Looking up teacher ID for user ID: ${userId}`);

  // Check cache first
  if (userToTeacherMap.has(userId)) {
    const teacherId = userToTeacherMap.get(userId) || null;
    console.log(`Found in cache: User ID ${userId} -> Teacher ID ${teacherId}`);
    return teacherId;
  }

  console.log(`User ID ${userId} not found in cache, fetching from API...`);

  // If not in cache, try to fetch all teachers and update cache
  try {
    const teachers = await teachersApi.getAllTeachers({ skip: 0, limit: 100 });
    console.log(`Fetched ${teachers.length} teachers from API`);

    teachers.forEach(teacher => {
      userToTeacherMap.set(teacher.user_id, teacher.id);
      teacherToUserMap.set(teacher.id, teacher.user_id);
      console.log(`Mapped: User ID ${teacher.user_id} <-> Teacher ID ${teacher.id}`);
    });

    const teacherId = userToTeacherMap.get(userId) || null;
    console.log(`After API fetch: User ID ${userId} -> Teacher ID ${teacherId}`);
    return teacherId;
  } catch (error) {
    console.error('Error getting teacher ID from user ID:', error);
    return null;
  }
};

/**
 * Get user ID from student ID
 */
export const getUserIdFromStudentId = async (studentId: number): Promise<number | null> => {
  console.log(`Looking up user ID for student ID: ${studentId}`);

  // Check cache first
  if (studentToUserMap.has(studentId)) {
    const userId = studentToUserMap.get(studentId) || null;
    console.log(`Found in cache: Student ID ${studentId} -> User ID ${userId}`);
    return userId;
  }

  console.log(`Student ID ${studentId} not found in cache, fetching from API...`);

  // If not in cache, try to fetch the specific student
  try {
    const student = await studentsApi.getStudentById(studentId);
    console.log(`Fetched student from API:`, student);

    if (student) {
      userToStudentMap.set(student.user_id, student.id);
      studentToUserMap.set(student.id, student.user_id);
      console.log(`Mapped: Student ID ${student.id} <-> User ID ${student.user_id}`);
      return student.user_id;
    }

    console.log(`No student found with ID ${studentId}`);
    return null;
  } catch (error) {
    console.error('Error getting user ID from student ID:', error);
    return null;
  }
};

/**
 * Get user ID from teacher ID
 */
export const getUserIdFromTeacherId = async (teacherId: number): Promise<number | null> => {
  console.log(`Looking up user ID for teacher ID: ${teacherId}`);

  // Check cache first
  if (teacherToUserMap.has(teacherId)) {
    const userId = teacherToUserMap.get(teacherId) || null;
    console.log(`Found in cache: Teacher ID ${teacherId} -> User ID ${userId}`);
    return userId;
  }

  console.log(`Teacher ID ${teacherId} not found in cache, fetching from API...`);

  // If not in cache, try to fetch the specific teacher
  try {
    const teacher = await teachersApi.getTeacherById(teacherId);
    console.log(`Fetched teacher from API:`, teacher);

    if (teacher) {
      userToTeacherMap.set(teacher.user_id, teacher.id);
      teacherToUserMap.set(teacher.id, teacher.user_id);
      console.log(`Mapped: Teacher ID ${teacher.id} <-> User ID ${teacher.user_id}`);
      return teacher.user_id;
    }

    console.log(`No teacher found with ID ${teacherId}`);
    return null;
  } catch (error) {
    console.error('Error getting user ID from teacher ID:', error);
    return null;
  }
};
