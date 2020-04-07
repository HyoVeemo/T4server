import Treatment from '../models/Treatment.model';
import HospitalOffice from '../models/HospitalOffice.model';

interface IUpdateOfficeData { // 진료실 정보 수정용
    officeName?: string;
    treatmentNameArr?: Array<string[]>;
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

    /**
     * 진료실 정보 수정.
     * @param officeIndex 
     * @param alterOfficeData 
     */
    async updateHospitalOffice(officeIndex, alterOfficeData: IUpdateOfficeData) {
        if (alterOfficeData.officeName) {
            console.log(alterOfficeData.officeName, '실행됨');
            const change = { officeName: alterOfficeData.officeName };
            const option = { where: { officeIndex: officeIndex } };
            await HospitalOffice.update(change, option);
        }

        if (alterOfficeData.treatmentNameArr) {
            console.log(alterOfficeData.treatmentNameArr, '실행됨');
            for (const treatmentName of alterOfficeData.treatmentNameArr) {
                let treatmentIndex = await hospitalOfficeService.getTreatmentIndexByOfficeIndexAndTreatmentName(officeIndex, treatmentName[0]);
                let change = { treatmentName: treatmentName[1] };
                let option = { where: { treatmentIndex: treatmentIndex } };
                await Treatment.update(change, option);
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
            attributes: ['officeName'],
            include: [
                {
                    model: Treatment,
                    as: 'treatment',
                    required: true
                }
            ]
        }
        return await HospitalOffice.findAll(option);
    }

    /**
     * 진료실 번호와 진료 항목 이름으로 진료 항목 번호 찾기.
     * @param officeIndex 
     * @param treatmentName 
     */
    async getTreatmentIndexByOfficeIndexAndTreatmentName(officeIndex, treatmentName) {
        const result = await Treatment.findOne({
            where: { officeIndex: officeIndex, treatmentName: treatmentName }
        });
        return result["dataValues"]["treatmentIndex"];
    }
}

export const hospitalOfficeService = new HospitalOfficeService();