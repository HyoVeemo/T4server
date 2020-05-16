import Treatment from '../models/Treatment.model';
import HospitalOffice from '../models/HospitalOffice.model';

interface IUpdateOfficeData { // 진료실 정보 수정용
    officeName?: string;
    treatmentNameArr?: Array<string[]>;
    newTreatmentNameArr?: Array<string[]>;
}

class HospitalOfficeService {
    constructor() { }
    /**
     * 진료실 등록
     * @param registerOfficeData
     */
    async registerHospitalOffice(registerOfficeData) {
        return await HospitalOffice.create(registerOfficeData);
    }

    /**
     * 진료항목 등록.
     * @param registerTreatmentData
     */
    async registerTreatment(registerTreatmentData) {
        return await Treatment.create(registerTreatmentData);
    }

    async getOffices(hpid: string) {
        const option = {
            where: { hpid: hpid },
            include: [
                {
                    model: Treatment,
                    required: false
                }
            ]
        }
        return await HospitalOffice.findAll(option);
    }

    /* 진료실 정보 수정 */
    async updateHospitalOffice(officeIndex, alterOfficeData: IUpdateOfficeData) {
        if (alterOfficeData.officeName) {
            const change = { officeName: alterOfficeData.officeName };
            const option = { where: { officeIndex: officeIndex } };
            await HospitalOffice.update(change, option);
        }

        if (alterOfficeData.treatmentNameArr) {
            for (const treatmentName of alterOfficeData.treatmentNameArr) {
                let treatmentIndex = await hospitalOfficeService.getTreatmentIndexByOfficeIndexAndTreatmentName(officeIndex, treatmentName[0]);
                let change = { treatmentName: treatmentName[1] };
                let option = { where: { treatmentIndex: treatmentIndex } };
                await Treatment.update(change, option);
            }
        }

        if (alterOfficeData.newTreatmentNameArr) {
            for (const treatmentName of alterOfficeData.newTreatmentNameArr) {
                const data = { officeIndex: officeIndex, treatmentName: treatmentName };
                await Treatment.create(data);
            }
        }
    }

    async deleteHospitalOffice(officeIndex: number) {
        await HospitalOffice.destroy({
            where: {
                officeIndex: officeIndex
            }
        })
    }

    async getOfficeNameAndTreatmentByHpid(hpid) {
        const option = {
            where: {
                hpid: hpid
            },
            attributes: ['officeIndex', 'officeName'],
            include: [
                {
                    model: Treatment,
                    as: 'treatment',
                    required: false
                }
            ]
        }
        return await HospitalOffice.findAll(option);
    }

    async getTreatmentIndexByOfficeIndexAndTreatmentName(officeIndex, treatmentName) {
        const result = await Treatment.findOne({
            where: { officeIndex: officeIndex, treatmentName: treatmentName }
        });
        return result["dataValues"]["treatmentIndex"];
    }
}

export const hospitalOfficeService = new HospitalOfficeService();