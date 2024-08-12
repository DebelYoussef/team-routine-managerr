import { asc, between, count, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from './db';
import {  user,routine,question,option, note } from './schema';
// src/queries.ts
// src/queries.ts
export async function getUserById(id: number) {
    try {
      const result = await db.select().from(user).where(eq(user.id, id));
      return result;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  }
  export async function getNotes(id: number) {
    try {

      const result = await db.select().from(note).where(eq(note.employeeId, id));
      return result;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  }

  export async function deleteNote(id: number) {
    try {

       await db.delete(note).where(eq(note.id, id));
    
    } catch (error) {
      console.error('Error Deleting note by id:', error);
      throw error;
    }
  }


  export async function getUsersBySocietyId(societyId: number) {
    try {
      const results = await db.select().from(user).where(eq(user.societyId, societyId));
      return results;
    } catch (error) {
      console.error('Error fetching users by Society ID:', error);
      throw error;
    }
  }
  export async function createUser(firstName: string, lastName: string, email: string, societyId: number, role?: string) {
    try {
      const result = await db.insert(user).values({
        firstName,
        lastName,
        email,
        societyId,
        role,
      }).execute();
      
      return result;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  export const insertRoutine = async (routineData: any) => {
    return db.insert(routine).values(routineData).returning({
        id: routine.id, // Adjust based on your actual schema
      });
  };
  
  // Function to insert a question
  export const insertQuestion = async (questionData: any) => {
    return db.insert(question).values(questionData).returning({
        id: question.id, // Adjust based on your actual schema
      });
  };
  
  // Function to insert an option
  export const insertOption = async (optionData: any) => {
    return db.insert(option).values(optionData);
  };
  