import AWS from 'aws-sdk';
AWS.config.update({ region: 'ap-northeast-1' });

const generateAuthenticationNumber = () => {
    let authenticationNumber: string = '';
    for (let i = 0; i < 6; i++) {
        let ranNum = Math.floor(Math.random() * 9) + 1;
        authenticationNumber = authenticationNumber.concat(ranNum.toString());
    }

    return authenticationNumber;
};

export default (phoneNumber) => {
    const authenticationNumber = generateAuthenticationNumber();
    const params = {
        Message: `[뽀듬] 인증번호는 ${authenticationNumber}입니다. 정확히 입력해주세요.`,
        PhoneNumber: '+82' + phoneNumber
    };

    const publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

    publishTextPromise.then(
        function (data) {
            console.log("MessageID is ", data.MessageId);
        }).catch(
            function (err) {
                console.error(err, err.stack);
            }
        )

    return authenticationNumber;
}