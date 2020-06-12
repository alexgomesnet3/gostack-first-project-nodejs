import { Router, request, response } from 'express';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();
const appointmentsRepository = new AppointmentsRepository();

appointmentsRouter.get('/', (request, response) => {
  const appointments = appointmentsRepository.allAppointments();

  if (appointments.length === 0) {
    return response.status(404).json({ message: 'Appointments not found!' });
  }

  return response.json(appointments);
})

appointmentsRouter.post('/', (request, response) => {
  try {
    const { provider, date } = request.body;

    const parsedDate = parseISO(date);

    const createAppointment = new CreateAppointmentService(
      appointmentsRepository,
    );

    const appointment = createAppointment.execute({provider, date: parsedDate});

    return response.json(appointment);
  } catch(err) {
    return response.status(404).json({ error: err.message });
  }
})

export default appointmentsRouter;
