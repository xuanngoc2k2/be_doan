import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from 'src/users/users.service';
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService,
    private mailerService: MailerService,
    private readonly userService: UsersService
  ) { }


  @Get()
  @Public()
  @ResponseMessage("Test email")
  async handleTestEmail(username: string, day: number, email: string) {
    await this.mailerService.sendMail({
      to: email,
      from: 'adadad@example.com',
      subject: 'Daily Reminder',
      template: 'test', // Đặt tên template ở đây
      context: {
        // Dữ liệu có thể được truyền vào template, ví dụ:
        username: username,
        day: day
        // Thêm các dữ liệu khác nếu cần
      },
    })
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async sendReminderEmails() {
    const users = await this.userService.findAll(); // Lấy danh sách tất cả người dùng
    users.forEach(async user => {
      const lastLogin = user.last_login; // Thời gian cuối đăng nhập của người dùng
      const day = this.isReminderNeeded(lastLogin);
      // console.log(day)
      if (day >= 1) {
        await this.handleTestEmail(user.full_name, Math.floor(day), user.email); // Gửi email nhắc nhở
      }
    });
  }

  private isReminderNeeded(lastLogin: Date): number {
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // Số mili giây trong 1 ngày
    const currentTime = new Date().getTime();

    const differenceInMilliseconds = currentTime - lastLogin.getTime();
    const differenceInDays = differenceInMilliseconds / oneDayInMilliseconds;

    return differenceInDays;
  }
}
