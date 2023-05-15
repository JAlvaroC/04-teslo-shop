import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Req,
  Headers,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders, request } from 'http';
import { User } from './entities/user.entity';
import { RawHeaders, GetUser, Auth } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { ApiTags } from '@nestjs/swagger';

// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  @Post('login')
  loginnUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User, // todo:algo
  ) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    // @GetUser('email', 'role', 'fullName') user: User,//no es posible mandar asi
    // @GetUser(['email', 'role', 'fullName']) user: User, //no es posible mandar asi
    @GetUser() user: User, //no es posible mandar asi
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string,
    @Headers() headers: IncomingHttpHeaders,
  ) {
    // console.log(request);
    // console.log({ user: request.user });
    // return 'Hola mundo Private';
    // console.log(user);
    // console.log(request);
    return {
      ok: true,
      message: 'Hola Mundo Private',
      // user: { name: 'Alvaro' },
      user,
      userEmail,
      rawHeaders,
      headers,
    };
  }
  @Get('private2')
  // NOTE: Trabajar con setMetaData es muy volatil
  @RoleProtected(
    ValidRoles.superUser,
    ValidRoles.admin,
    // , ValidRoles.user
  )
  // @SetMetadata('roles', ['admin', 'super-user']) //añadir informacion extra al controlador
  @UseGuards(AuthGuard(), UserRoleGuard) // si es personalzado no se pone() para noc rear la isntancia
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  // @Auth(ValidRoles.admin, ValidRoles.superUser)
  // @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  // @UseGuards(AuthGuard(), UserRoleGuard) // si es personalzado no se pone() para noc rear la isntancia
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  //   @Get()
  //   findAll() {
  //     return this.authService.findAll();
  //   }

  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.authService.findOne(+id);
  //   }

  //   @Patch(':id')
  //   update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //     return this.authService.update(+id, updateAuthDto);
  //   }

  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.authService.remove(+id);
  //   }
}
