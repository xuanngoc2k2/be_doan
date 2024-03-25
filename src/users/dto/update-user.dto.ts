import { IsDate, IsEmail, IsNotEmpty } from "class-validator";

export class UpdateUserDto {
    @IsNotEmpty({ message: "Không được để trống !!" })
    username: string;

    @IsNotEmpty({ message: "Không được để trống !!" })
    password: string;

    @IsNotEmpty({ message: "Không được để trống !!" })
    @IsEmail({}, { message: "Phải là email" })
    email: string;

    @IsNotEmpty({ message: "Không được để trống !!" })
    phone_number: string;

    @IsNotEmpty({ message: "Không được để trống !!" })
    full_name: string;

    // @IsDate({ message: "Phải là ngày !!" })
    date_of_birth: Date;
}
