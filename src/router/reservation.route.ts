import express from 'express';

class ReservationRoute {
    public reservationRouter: express.Router = express.Router();
    constructor() {
        this.reservationRouter.post('/reservation/:hpid', reserveHospital);
    }
}

async function reserveHospital(req, res) {

}