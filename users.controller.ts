import { subject } from '@casl/ability';
import { Auth } from '@common/decorators/auth.decorator';
import { PublicResource } from '@common/decorators/public-resource.decorator';
import { SensitiveData } from '@common/decorators/sensitive-data.decorator';
import { PaginationDto } from '@common/dtos/pagination-dto';
import { RequestWithUser } from '@common/types/requestWithUser';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from '@users/dtos/create-user.dto';
import { RegisterUserDto } from '@users/dtos/register-user.dto';
import { toUpdateUser, UpdateUserDto } from '@users/dtos/update-user.dto';
import { UsersService } from '@users/services/users.service';
import { exceptionMessages } from '@utils/exceptionMessages';
import { getPaginationOptions } from '@utils/getPaginationOptions';

type PaginateWhere = Prisma.UserWhereInput;
type PaginateSelect = Prisma.UserSelect;
type PaginateInclude = Prisma.UserInclude;
type PaginateOrderBy = Prisma.Enumerable<Prisma.UserOrderByWithRelationInput>;

type Pagination = PaginationDto<
  PaginateWhere,
  PaginateSelect,
  PaginateInclude,
  PaginateOrderBy
>;

const SUBJECT = 'User';

@ApiTags('users')
@SensitiveData('password')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth('create', SUBJECT)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const userExists = await this.usersService.findOneByEmail(
      createUserDto.email,
    );

    if (userExists) {
      throw new BadRequestException(exceptionMessages.ALREADY_EXIST);
    }

    return this.usersService.create(createUserDto);
  }

  @PublicResource()
  @Post('/register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const userExists = await this.usersService.findOneByEmail(
      registerUserDto.email,
    );

    if (userExists) {
      throw new BadRequestException(exceptionMessages.ALREADY_EXIST);
    }

    await this.usersService.register(registerUserDto);

    return { status: 'ok' };
  }

  @Auth('read', SUBJECT)
  @Get()
  async findAll(@Query() pagination: Pagination) {
    return this.usersService.findAll(
      getPaginationOptions<
        PaginateWhere,
        PaginateSelect,
        PaginateInclude,
        PaginateOrderBy
      >(pagination),
    );
  }

  @Auth('read', SUBJECT)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOneOrThrow(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: RequestWithUser,
  ) {
    const dbUser = await this.usersService.findOneOrThrow(id);

    if (request.user.ability.cannot('update', subject(SUBJECT, dbUser))) {
      throw new ForbiddenException(exceptionMessages.FORBIDDEN);
    }

    return this.usersService.update(id, toUpdateUser(updateUserDto));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
