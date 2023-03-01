import Securex from '../artifacts/src/contracts/Securex.sol/Securex.json'
import React, { Component } from 'react';
import { Card, Button, Form, } from 'react-bootstrap';

import Navbar from './Navbar'

import Web3 from 'web3';
import './App.css';

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {

    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()

        this.setState({ account: accounts[0] })
        // Network ID
        const networkId = await web3.eth.net.getId()
       // const networkData = Securex.networks[networkId]
        const networkAdress = "0x83749167D4B8D7cAb243BD45875EA1fA2b2726a2"
        if (networkAdress) {
            const securex = new web3.eth.Contract(Securex.abi, networkAdress)
            this.setState({ securex })
            const caseCount = await securex.methods.totalCases().call()
            this.setState({ caseCount })
            console.log(caseCount)
            for (var i = 1; i <= caseCount; i++) {
                const aCase = await securex.methods.cases(i).call()
                this.setState({
                    cases: [...this.state.cases, aCase]
                })
            }



            console.log(this.state.cases)


            this.setState({ loading: false })
        } else {
            window.alert('Securex contract not deployed to detected network.')
        }
    }
    getEvidencesOfCase = async () => {
        console.log('Get Evidences Called')
        const caseId = this.state.getCaseId
        const contextCase = this.state.cases[caseId - 1];


        for (var j = 1; j <= contextCase.totalEvidences; j++) {
            let evd = await this.state.securex.methods.getEvidenceById(caseId, j).call()
            this.setState({
                evidences: [...this.state.evidences, evd]
            })
        }
        console.log(this.state.evidences)
    }

    captureFile = event => {

        event.preventDefault()
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)

        reader.onloadend = () => {
            this.setState({ buffer: Buffer(reader.result) })
            console.log('buffer', this.state.buffer)
        }
    }

    uploadFile = () => {

        console.log("Submitting file to ipfs...")

        //adding file to the IPFS
        ipfs.add(this.state.buffer, (error, result) => {
            console.log('Ipfs result', result)
            if (error) {
                console.error(error)
                return
            }

            this.setState({ loading: true, })

            console.log(this.state.evidenceDetails)

            this.state.securex.methods.registerEvidence(this.state.evidenceDetails.caseId,
                this.state.evidenceDetails.description,
                result[0].hash,

                this.state.evidenceDetails.createdDate).send({ from: this.state.account }).on('transactionHash', (hash) => {
                   window.location.reload()
                    this.setState({ loading: false })
                })
        })
    }
    registerCase = () => {
        console.log("Age Verification")

        console.log(this.state.caseDetails)

        this.setState({ loading: true })

        this.state.securex.methods.registerCase(this.state.caseDetails.courtId,

            this.state.caseDetails.caseDescription,
            this.state.caseDetails.startDateTime).send({ from: this.state.account }).on('transactionHash', (hash) => {
                let newCaseId = this.state.cases.length + 1
                window.alert("Successfully registered with Case ID: " + newCaseId)
                this.setState({ loading: false })
            })

    }

    handleCaseInputChange = (event) => {
        this.setState({
            caseDetails: {
                ...this.state.caseDetails,
                [event.target.name]: event.target.value
            }
        });
    }
    handleEvidenceInputChange = (event) => {
        this.setState({
            evidenceDetails: {
                ...this.state.evidenceDetails,
                [event.target.name]: event.target.value
            }
        });
    }
    handleEvidenceCaseInput = (event) => {
        this.setState({
            getCaseId: event.target.value

        });
    }
    tipEvidenceOwner(address, tipAmount) {
        this.setState({ loading: true })
        this.state.securex.methods.tipEvidenceOwner(address).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
            this.setState({ loading: false })
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            account: '',
            securex: null,
            loading: true,
            evidenceDetails: {
                caseId: '',
                description: '',

                createdDate: ''
            },
            caseDetails: {
                courtId: '',

                caseDescription: '',
                startDateTime: ''
            },
            uploadedImage: '',
            cases: [],
            evidences: [],
            getCaseId: ''
        }

        this.uploadFile = this.uploadFile.bind(this)
        this.captureFile = this.captureFile.bind(this)
    }

    render() {

        return (
            <div>
                <Navbar account={this.state.account} />
                {this.state.loading
                    ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
                    :
                    <div>


                        <div className="container-fluid mt-5">
                            <div className="row">
                                <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
                                    <div className="content mr-auto ml-auto">
                                        <p>&nbsp;</p>
                                       
                                        <Card>
                                            <Card.Header as="h2">Verify Age</Card.Header>
                                            <Card.Body>
                                            
                                                <Card.Title>Enter your age</Card.Title>

                                                <Form onSubmit={(event) => {
                                                    console.log('Age Submitted')
                                                    event.preventDefault()
                                                    this.registerCase();

                                                }}> 
                                                <Form.Group className="mb-3">
                                                <Form.Control type="text" placeholder="age" value={this.state.caseDetails.courtId}
                                                    onChange={this.handleCaseInputChange} name="courtId" />

                                                    </Form.Group>
                                                    <Button variant="primary" type="submit" >Verify Age</Button>

                                                </Form>
                                            </Card.Body>
                                        </Card>
                                        <p>&nbsp;</p>

                                    </div>
                                </main>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default App;