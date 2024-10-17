import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { ReservationDto } from './reservation.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
      
    };
  }

  @Post("reservation")
  postReservation(@Body() body: ReservationDto, @Res() res: Response) {
    let errors = []
    if (body.name === "") {
      errors.push("Name is required")
    }
    if(body.name.length < 2) {
      errors.push("Name must be at least 2 characters long")
    }
    if(body.email === "") {
      errors.push("Email is required")
    }
    if(body.email.indexOf("@") === -1) {
      errors.push("Email must contain @")
    } else {
      let emailParts = body.email.split("@")


      if(emailParts[0].length <= 0 || emailParts[1].length <= 0) {
        errors.push("Not a valid email")
      }
    }
    if(body.date.toString() === "") {
      errors.push("Date is required")
    }
    const now = new Date()
    let date: any = body.date.toString()
    date = Date.parse(date)

    if(date <  now){
      errors.push("Date must be in the future")
    }
    if(body.seats < 1 || body.seats > 10) {
      errors.push("Seats must be between 1 and 10")
    }


    if(errors.length > 0) {
      res.render("reservationForm", {errors: errors, message: "Reservation Form",reservation: body});
      return
    }

    res.redirect(303,"/successPage")

    
  }

  @Get("reservation")
  @Render('reservationForm')
  getReservationForm() {
    return {
      message: "Reservation Form",
      errors: [],
      reservation: {}
    };
  }


  @Get("successPage")
  @Render('successPage')
  getSuccessPage() {
    return {
      message: "Sikeres foglalás",
    };
  }
}
