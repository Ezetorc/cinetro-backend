import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  await prisma.ticket.deleteMany()
  await prisma.screening.deleteMany()
  await prisma.seat.deleteMany()
  await prisma.room.deleteMany()
  await prisma.userRole.deleteMany()
  await prisma.user.deleteMany()
  await prisma.movieCategory.deleteMany()
  await prisma.category.deleteMany()
  await prisma.movie.deleteMany()
  await prisma.cinema.deleteMany()
  await prisma.role.deleteMany()
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash('123456', saltRounds)

  // Categorías
  const action = await prisma.category.create({ data: { name: 'Action' } })
  const drama = await prisma.category.create({ data: { name: 'Drama' } })

  // Películas
  const movie1 = await prisma.movie.create({
    data: {
      title: 'Fast & Curious',
      duration: 120,
      thumbnail: 'fast.jpg',
      trailer: 'https://youtube.com/trailer1',
      classification: 'THIRDTEEN',
      description: 'Acción y velocidad.',
      distributor: 'Universal',
      releaseDate: new Date('2024-05-01'),
      categories: {
        create: [{ categoryId: action.id }, { categoryId: drama.id }]
      }
    }
  })

  const movie2 = await prisma.movie.create({
    data: {
      title: 'Love and Lasers',
      duration: 90,
      thumbnail: 'love.jpg',
      trailer: 'https://youtube.com/trailer2',
      classification: 'SIXTEEN',
      description: 'Amor en una galaxia lejana.',
      distributor: 'Fox',
      releaseDate: new Date('2024-06-01'),
      categories: {
        create: [{ categoryId: drama.id }]
      }
    }
  })

  // Cines
  const cinema1 = await prisma.cinema.create({
    data: {
      name: 'Cinepolis Central',
      location: 'Av. Siempre Viva 123',
      latitude: 34.12345678,
      longitude: -58.12345678
    }
  })

  const cinema2 = await prisma.cinema.create({
    data: {
      name: 'Multiplex Norte',
      location: 'Calle Falsa 456',
      latitude: 35.0,
      longitude: -59.0
    }
  })

  // Salas
  const room1 = await prisma.room.create({
    data: {
      name: 'Sala 1',
      seatRows: 5,
      seatColumns: 5,
      cinemaId: cinema1.id
    }
  })

  const room2 = await prisma.room.create({
    data: {
      name: 'Sala 2',
      seatRows: 4,
      seatColumns: 4,
      cinemaId: cinema2.id
    }
  })

  // Roles
  await prisma.role.create({
    data: {
      name: 'user'
    }
  })

  const adminRole = await prisma.role.create({
    data: {
      name: 'admin'
    }
  })

  await prisma.role.create({
    data: {
      name: 'manager'
    }
  })

  const cashierRole = await prisma.role.create({
    data: {
      name: 'cashier'
    }
  })

  const operatorRole = await prisma.role.create({
    data: {
      name: 'operator'
    }
  })

  // Asientos
  const seatA1 = await prisma.seat.create({
    data: { roomId: room1.id, row: 'A', number: 1 }
  })

  const seatB2 = await prisma.seat.create({
    data: { roomId: room1.id, row: 'B', number: 2 }
  })

  // Proyecciones
  const screening1 = await prisma.screening.create({
    data: {
      movieId: movie1.id,
      roomId: room1.id,
      startTime: new Date('2025-06-16T18:00:00'),
      format: 'TWO_D'
    }
  })

  await prisma.screening.create({
    data: {
      movieId: movie2.id,
      roomId: room2.id,
      startTime: new Date('2025-06-17T20:00:00'),
      format: 'THREE_D'
    }
  })

  // Usuarios
  const user1 = await prisma.user.create({
    data: {
      name: 'admin',
      surname: 'admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      birthDate: new Date('1990-01-01'),
      phoneNumber: '1234567890',
      genre: 'MALE',
      preferredCinemaId: cinema1.id
    }
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'cashier',
      surname: 'cashier',
      email: 'cashier@gmail.com',
      password: hashedPassword,
      birthDate: new Date('1985-05-10'),
      phoneNumber: '0987654321',
      genre: 'MALE',
      preferredCinemaId: cinema2.id
    }
  })

  const user3 = await prisma.user.create({
    data: {
      name: 'operator',
      surname: 'operator',
      email: 'operator@gmail.com',
      password: hashedPassword,
      birthDate: new Date('1985-05-10'),
      phoneNumber: '0987654321',
      genre: 'MALE',
      preferredCinemaId: cinema2.id
    }
  })

  // UserRoles
  await prisma.userRole.create({
    data: {
      userId: user1.id,
      roleName: adminRole.name
    }
  })

  await prisma.userRole.create({
    data: {
      userId: user2.id,
      roleName: cashierRole.name
    }
  })

  await prisma.userRole.create({
    data: {
      userId: user3.id,
      roleName: operatorRole.name
    }
  })

  // Tickets
  await prisma.ticket.create({
    data: {
      userId: user1.id,
      seatId: seatA1.id,
      screeningId: screening1.id,
      status: 'RESERVED'
    }
  })

  await prisma.ticket.create({
    data: {
      userId: user2.id,
      seatId: seatB2.id,
      screeningId: screening1.id,
      status: 'SOLD'
    }
  })

  console.log('✅ Seed ejecutado correctamente')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
