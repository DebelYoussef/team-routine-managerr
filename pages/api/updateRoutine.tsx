import { note } from '../../src/schema'; // Adjust the path to your schema file
import { db } from '../../src/db'; // Adjust the path to your db connection file
import { NextApiRequest, NextApiResponse } from 'next';
import { deleteNote } from '../../src/queries';
import { routine, question, option, membership } from '../../src/schema';
import { asc, between, count, eq, getTableColumns, sql,and } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

if (req.method === 'POST') {
    try {
      const {routineName,routineId,description,questions, questionNeedUpdate, optionNeedUpdate,newOptions,deleteOption,deleteQuestion,participantOut,participantIn,email,activer,visibilty,frequency } = req.body;
      console.log("Incoming request data:", req.body);

      if (routineName) {
                  await db.update(routine)
            .set({ routineName: routineName })
            .where(eq(routine.id, routineId))
         }
      if (description) {
        await db.update(routine)
        .set({ description: description })
        .where(eq(routine.id, routineId))
      }
     
      if (optionNeedUpdate) {
       
          for (const opt of optionNeedUpdate) {
            await db.update(option)
        .set({ value: opt.value })
        .where(eq(option.id, opt.id))
          }
        
      }

      if (questionNeedUpdate) {
       
        for (const Q of questionNeedUpdate) {
          await db.update(question)
      .set({ question: Q.question })
      .where(eq(question.id, Q.id))
        }
      
    }
    if(newOptions){
      for (const opt of newOptions) {
        await db.insert(option).values({
          value: opt.value,
          questionId: opt.questionId,
        });
      }
    }
    if(deleteOption)
    {
      for (const opt of deleteOption) {
        await db.delete(option)
  .where(eq(option.id, opt.id))
 


      }

    }
    if(deleteQuestion)
      {
        for (const Q of deleteQuestion) {
          await db.delete(question)
    .where(eq(question.id, Q.id))
  
        }
  
      }
      if(participantOut)
        {
          for (const P of participantOut) {
            await db.delete(membership)
            .where(and(eq(membership.employeeId, P), eq(membership.routineId, routineId)));
          
          }
    
        }
        if(participantIn){
          for (const P of participantIn) {
            await db.insert(membership).values({
              employeeId: P,
              routineId:routineId,
            });
          }
        }
        if(questions){
          const questionIds = [];
          for (const q of questions) {
            const questionResult = await db.insert(question).values({
              routineId: routineId,
              question: q.text,
              type: q.type,
            }).returning({
              id: question.id,
            });
    
            questionIds.push(questionResult[0].id);
    
            // Insert options if any
            if (q.options && q.options.length > 0) {
              for (const opt of q.options) {
                await db.insert(option).values({
                  value: opt,
                  questionId: questionResult[0].id,
                });
              }
            }
          }
    
      }
     if(email){
      await db.update(routine)
      .set({ email: email })
      .where(eq(routine.id, routineId))

     }
     await db.update(routine)
      .set({ active: activer })
      .where(eq(routine.id, routineId))

      if(visibilty){
        await db.update(routine)
        .set({ privacy: visibilty})
        .where(eq(routine.id, routineId))
  
       }
       if(frequency){
        await db.update(routine)
        .set({ frequency: frequency })
        .where(eq(routine.id, routineId))
  
       }
     
      
      

     

      res.status(200).json({ message: 'routine updated' });
    } catch (error: any) {
      console.error('Error Note:', error);

      
    }
  } 
}