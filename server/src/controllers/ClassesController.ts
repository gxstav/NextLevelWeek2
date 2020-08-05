import { Request , Response, response } from 'express'
import database from '../database/connection'
import convertHourToMinutes from '../utils/convertHourToMinutes'



interface ScheduleItem {
  week_day: number,
  from: string,
  to: string
}

export default class ClassesController {
   async create(request: Request, response: Response) {
    const { 
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule
     } = request.body
  
    const trx = await database.transaction()
    
    try {
      const insertedUsersId = await trx('users').insert({
        name,
        avatar,
        whatsapp,
        bio
      })
    
      const user_id = insertedUsersId[0]
    
      const insertedClassesId = await trx('classes').insert({
        subject,
        cost,
        user_id,
      })
    
      const class_id = insertedClassesId[0]
    
      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          week_day: scheduleItem.week_day,
          from: convertHourToMinutes(scheduleItem.from),
          to: convertHourToMinutes(scheduleItem.to),
          class_id
        }
      })
    
      await trx('schedules').insert(classSchedule)
    
      await trx.commit()
    
      return response.status(201).send()
    } catch (error) {
  
      await trx.rollback()
      console.error(error);
  
      return  response.status(400).json({
        error: 'Unexpected error while creating new class.'
      })
    }
  }

  async index(request: Request, response: Response) {
    const filters = request.query

    if (!filters.week_day || !filters.subject || !filters.time) {
      return response.status(400).json({
        error: 'Missing filters.'
      })
    }


    const timeInMinutes = convertHourToMinutes(String(filters.time))

    const classes = await database('classes')
      .whereExists(function(){
        this.select('schedules.*')
        .from('schedules')
        .whereRaw('`schedules`.`class_id` = `classes`.`id`')
        .whereRaw('`schedules`.`week_day` = ??', [Number(filters.week_day)])
        .whereRaw('`schedules`.`week_day` = ??', [Number(filters.week_day)])
        .whereRaw('`schedules`.`from` <= ??', [Number(timeInMinutes)])
        .whereRaw('`schedules`.`to` > ??', [Number(timeInMinutes)])
      })
      .where('classes.subject', '=' , String(filters.subject))
      .join('users', 'classes.user_id', '=', 'users.id')
      .select(['classes.*', 'users.*'])

      return response.json(classes)
  }


}