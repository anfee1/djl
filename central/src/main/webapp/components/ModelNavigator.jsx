import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import ModelView from './ModelView';

import axios from 'axios'

const useStyles = makeStyles({
	view_root: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "nowrap",
		justifyContent: "flex-start",
		alignContent: "stretch",
		alignItems: "flex-start",
		margin: '3em',
	},
	navigator_root: {
		order: 0,
		flex: "0 1 auto",
		alignSelf: "stretch",
		maxHeight: '600px',
		overflowY: "auto",

	},
	inputComponent: {
        height: '15%',
        width:  '33%',
        backgroundColor: 'white',
        boxShadow: '0 1px 0 0 rgba(170,170,170,0.01)'
    },
    inputText: {
        color: '#D3D4D0',
        fontSize: '16px',
        letterSpacing: '0.5px',
        lineHeight: '28px',
        textAlign: 'center',
    },
	model_root: {
		order: 0,
		flex: "2 1 auto",
		alignSelf: "stretch",
	//			'-webkit-box-shadow': '0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(11,60,93,0)',
	//	boxShadow: '0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(11,60,93,0)',
	},
});


const useFetch = (url) => {
	const [data, setData] = useState([]);

	// empty array as second argument equivalent to componentDidMount
	useEffect(() => {
		async function fetchData() {
			axios.get(url)
				.then(function(response) {
					console.log(response)

					let appdata = Object.keys(response.data).map(function(key) {
						console.log(key)
						return {
							key: key,
							title: key,
							models: response.data[key]
						};
					});
					console.log(appdata)
					setData(appdata);
				})
				.catch(function(error) {
					console.log(error);
				})
				.then(function() {
					// always executed
				});

		}
		fetchData();
	}, [url]);

	return data;
};





export default function ModelNavigator(props) {

	const classes = useStyles();

	const URL = 'http://localhost:8080/models';
	const modelZooData = useFetch(URL);

	const [model, setModel] = useState(null);
	const [modelList, setModelList] = useState([]);
	const [nameValue, setNameValue] = useState('');
	const [applicationValue, setApplicationValue] = useState('');
	const [versionValue, setVersionValue] = useState('');

    const filteredModels =
        modelZooData.map((application) => (
            application.models.filter((model) => {
                if ((versionValue == '') || (versionValue == model.version)){
                    if ((applicationValue == '') || (applicationValue == application.key)){
                        return model.name.toLowerCase().includes(nameValue.toLowerCase());
                    }
                }
            })
        ))

	const modelFilterOnChange = (event) => {
        setNameValue(event.target.value);
        setModelList(filteredModels)

    };

    const modelApplicationFilterOnChange = (event) => {
        setApplicationValue(event.target.value);
    };

    const modelVersionFilterOnChange = (event) => {
        setVersionValue(event.target.value);
    };

	return (
		<>
           <div className={classes.view_root}>
                <div className={classes.navigator_root}>
                    <TreeView
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                    >
                        <TreeItem nodeId="Model Searching" label="Model Search">
                            <TreeView
                                defaultCollapseIcon={<ExpandMoreIcon />}
                                defaultExpandIcon={<ChevronRightIcon />}
                            >
                                <TreeItem nodeId="Name" label="Name">
                                    <TextField
                                        id="name-search"
                                        label="Enter Name"
                                        value={nameValue}
                                        onChange={modelFilterOnChange}
                                        inputProps={{style: { backgroundColor:"white"},}}
                                    />
                                </TreeItem>
                                <TreeItem nodeId="Version" label="Version">
                                    <div onChange={modelVersionFilterOnChange}>
                                        <button disabled={versionValue=="0.0.1"} value="0.0.1" onClick={modelVersionFilterOnChange} > 0.0.1 </button>
                                        <button disabled={versionValue=="0.0.2"} value="0.0.2" onClick={modelVersionFilterOnChange} > 0.0.2 </button>
                                        <button disabled={versionValue=="0.0.3"} value="0.0.3" onClick={modelVersionFilterOnChange} > 0.0.3 </button>
                                        <button value="" onClick={modelVersionFilterOnChange} > Clear </button>
                                    </div>
                                </TreeItem>
                                <TreeItem nodeId="Application" label="Application">
                                    <div onChange={modelApplicationFilterOnChange}>
                                       <button disabled={applicationValue=='CV.ACTION_RECOGNITION'} value= 'CV.ACTION_RECOGNITION' onClick={modelApplicationFilterOnChange} > action_recognition </button>
                                       <button disabled={applicationValue=='CV.IMAGE_CLASSIFICATION'} value= 'CV.IMAGE_CLASSIFICATION' onClick={modelApplicationFilterOnChange} > image_classification </button>
                                       <button disabled={applicationValue=='CV.INSTANCE_SEGMENTATION'} value= 'CV.INSTANCE_SEGMENTATION' onClick={modelApplicationFilterOnChange} > instance_segmentation </button>
                                       <button disabled={applicationValue=='CV.OBJECT_DETECTION'} value= 'CV.OBJECT_DETECTION' onClick={modelApplicationFilterOnChange} > object_detection </button>
                                       <button disabled={applicationValue=='CV.POSE_ESTIMATION'} value='CV.POSE_ESTIMATION' onClick={modelApplicationFilterOnChange} > pose_estimation </button>
                                       <button disabled={applicationValue=='NLP.QUESTION_ANSWER'} value='NLP.QUESTION_ANSWER' onClick={modelApplicationFilterOnChange} > question_answer </button>
                                       <button disabled={applicationValue=='NLP.SENTIMENT_ANALYSIS'} value='NLP.SENTIMENT_ANALYSIS' onClick={modelApplicationFilterOnChange} > sentiment_analysis </button>
                                       <button disabled={applicationValue=='NLP.WORD_EMBEDDING'} value='NLP.WORD_EMBEDDING' onClick={modelApplicationFilterOnChange} > word_embedding </button>
                                       <button value='' onClick={modelApplicationFilterOnChange} > Clear </button>
                                    </div>
                                </TreeItem>
                            </TreeView>
                            <TreeItem nodeId="Models" label="Models">
                                <div>
                                    <button onClick={modelFilterOnChange} > Search </button>
                                    {modelList.map(application => (
                                      application.map((model) => (
                                          <TreeItem nodeId={model.name} label={model.name} onLabelClick={() => setModel(model)}>
                                          </TreeItem>
                                    ))))}
                                </div>
                            </TreeItem>
                        </TreeItem>
                    </TreeView>
                </div>
           </div>

			<div className={classes.view_root}>
				<div className={classes.navigator_root}>
				<TreeView

					defaultCollapseIcon={<ExpandMoreIcon />}
					defaultExpandIcon={<ChevronRightIcon />}
				>
					{modelZooData.map((application) => (
						<TreeItem nodeId={application.key} label={application.title}>
							{application.models.map((model) => (
								<TreeItem nodeId={model.name} label={model.name} onLabelClick={() => setModel(model)}>
								</TreeItem>
							))}
						</TreeItem>
					))}

				</TreeView>
				</div>

				{model != null &&
					<div className={classes.model_root}>
						<ModelView model={model} />
					</div>
				}
			</div>
		</>
	);
}