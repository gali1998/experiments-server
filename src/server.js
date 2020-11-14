import express from 'express';
import requestValidator from './requestValidaror';
import fileSystemService from './fileSystemService';
import bodyParser from 'body-parser';
import jsonCreatorService from './jsonCreatorService';

const app = express();

app.use(bodyParser.json());

const basePath = "C:/Users/Ron/Desktop/work/dbDirectory/";

app.post('/', (req, res) => {

    if (!requestValidator.isRequestValid(req)){
        let err = requestValidator.getValidationErrorMessage(req);

        return res.status(400).send({message: err});
    }

    let experimenterName = req.body.data.experiment_info.experimenter_name;
    let experimentName = req.body.data.experiment_info.experiment_name;
    fileSystemService.createExperimentFolderIfDoesNotExist(basePath, experimenterName, experimentName);

    let participantId = req.body.data.participant_info.participant_id;
    let filePath = fileSystemService.createExperimentPath(basePath, experimenterName, experimentName, participantId);

    if (fileSystemService.doesFileExist(filePath)){
        let message = "Participant ID already exists, participantId: " + participantId;
        return res.status(400).send({message});        
    }

    let jsonToSave = req.body.data;

    jsonCreatorService.removeExperimentInfo(jsonToSave);

    fileSystemService.createFile(filePath, JSON.stringify(jsonToSave));

    res.status(200).send();
});

app.get('/isAlive', (req, res) => {
    res.status(200).send({message:"Ani Sheled"});
});

app.listen(8000, () => {
    console.log("server started on port 8000");
});