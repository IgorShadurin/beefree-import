import React, {Component, Fragment} from 'react';
import {Doughnut} from 'react-chartjs-2';

class Layout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataStata: this.getDataStata(),
            instagramUsername: '',
            instagramProcess: false,
            instagramError: ''
        };
        this.instagramModal = null;
    }

    getDataStata = () => {
        let dataStata = {};
        if (localStorage.getItem('data_stata') !== null) {
            try {
                dataStata = JSON.parse(localStorage.getItem('data_stata'));
            } catch (e) {
            }
        }

        return dataStata;
    };

    setDataStata = (service, key, value) => {
        let data = this.getDataStata();
        data[service] = {...data[service], ...{[key]: value}};

        localStorage.setItem('data_stata', JSON.stringify(data));
        this.setState({
            dataStata: data
        });
    };

    onChange = (e) => {
        this.setState({
            [e.target.dataset.field]: e.target.value
        });
    };

    onInstagramReceiveInfo = () => {
        const url = `https://testeron.pro/insta/go.php?limit=100&login=${this.state.instagramUsername}`;
        this.setState({
            instagramProcess: true,
            instagramError: ''
        });

        fetch(url)
            .then(response => {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    return response.json();
                }

                throw new TypeError("Please check username or try again later");
            })
            .then(data => {
                console.log(data);
                let videosCount = 0;
                let photosCount = 0;
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach((item) => {
                        if (item.type === 'image') {
                            photosCount++;
                        } else if (item.type === 'video') {
                            videosCount++;
                        }
                    });
                }

                const stataResult = `Photos: ${photosCount}, videos: ${videosCount}`;
                console.log(stataResult);

                this.setDataStata('instagram', 'photos', photosCount);
                this.setDataStata('instagram', 'videos', videosCount);
                this.setDataStata('instagram', 'username', this.state.instagramUsername);
                window.jQuery(this.instagramModal).modal('hide');
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    instagramError: error.message
                })
            })
            .then(_ => {
                this.setState({
                    instagramProcess: false
                });

            });
    };

    connectInstagram = () => {
        this.setState({
            instagramUsername: ''
        });
        //window.open('https://api.instagram.com/oauth/authorize/?client_id=4d13c46e2674470b8ca898b7aa7954b3&redirect_uri=https://c3web.io/beefree/import_instagram.html&response_type=token', 'InstagramWindow', 'width=800, height=600');
    };

    connectDropbox = () => {
    };

    connectGoogleDrive = () => {
    };

    connectYoutube = () => {
    };

    connectFacebook = () => {
    };

    connectTwitter = () => {
    };

    notImplemented = (e) => {
        e.preventDefault();
        alert('Not implemented');
    };

    render() {
        const {dataStata, instagramProcess, instagramError} = this.state;

        let instagramData = {};
        const instagramOptions = {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '...'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        };
        if ("instagram" in dataStata) {
            instagramOptions.title.text = 'Username: ' + dataStata.instagram.username;
            instagramData = {
                datasets: [{
                    data: [
                        dataStata.instagram.photos,
                        dataStata.instagram.videos
                    ],
                    backgroundColor: [
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                    ],
                    label: 'Dataset 1'
                }],
                labels: [
                    'Photos',
                    'Videos'
                ]
            };
        }

        return (
            <Fragment>
                <div ref={modal => this.instagramModal = modal} className="modal fade bd-example-modal-lg"
                     id="instagramModal" tabIndex="-1" role="dialog"
                     aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-scrollable" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Instagram</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Instagram username</label>
                                    <input type="email"
                                           className="form-control"
                                           id="exampleInputEmail1"
                                           aria-describedby="emailHelp"
                                           data-field="instagramUsername"
                                           onChange={this.onChange}
                                           value={this.state.instagramUsername}
                                           placeholder="Your username"/>
                                    {/*<small id="emailHelp" className="form-text text-muted">
                                            Please, enter your username
                                        </small>*/}
                                </div>

                                {instagramError && <p>{instagramError}</p>}
                            </div>

                            <div className="modal-footer">
                                {instagramProcess && <button className="btn btn-outline-primary"
                                                             type="button"
                                                             disabled>
                                    Receiving info...
                                </button>}

                                {!instagramProcess && <button className="btn btn-outline-primary"
                                                              type="button"
                                                              onClick={this.onInstagramReceiveInfo}>
                                    Receive info
                                </button>}

                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
                    <h5 className="my-0 mr-md-auto font-weight-normal">BeeFree</h5>
                    <nav className="my-2 my-md-0 mr-md-3">
                        <a className="p-2 text-dark" href="index.html" onClick={this.notImplemented}>Home</a>
                        <a className="p-2 text-dark" href="about.html" onClick={this.notImplemented}>About SWARM</a>
                        <a className="p-2 text-dark" href="why.html" onClick={this.notImplemented}>Why Import?</a>
                        <a className="p-2 text-dark" href="works.html" onClick={this.notImplemented}>How it works</a>
                    </nav>
                    <a className="btn btn-outline-primary" href="signin.html" onClick={this.notImplemented}>Sign
                        in</a> &nbsp;
                    <a className="btn btn-outline-primary" href="signup.html" onClick={this.notImplemented}>Sign up</a>
                </div>

                <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
                    <h1 className="display-6">Data Dashboard</h1>
                    <p className="lead">List of data providers to import from</p>
                </div>

                <div className="container">

                    <div className="row">
                        <div className="col-sm-4">

                            <div className="card">
                                <div className="card-header">
                                    <strong>Instagram</strong>
                                </div>

                                <div className="card-body">
                                    <h5 className="card-title"/>
                                    <p className="card-text" id="instagram-data">
                                        {!("instagram" in dataStata) &&
                                        <span>Instagram is a popular photo and video-sharing social networking service owned by Facebook, Inc. Launched in October 2010.</span>}

                                        {"instagram" in dataStata &&
                                        <Doughnut data={instagramData} width={400} height={400}
                                                  options={instagramOptions}/>}

                                        {/*"instagram" in dataStata &&
                                        <span>Username: {dataStata.instagram.username}, Photos: {dataStata.instagram.photos}, videos: {dataStata.instagram.videos}</span>*/}
                                    </p>

                                    <button className="btn btn-primary"
                                            onClick={this.connectInstagram}
                                            data-toggle="modal"
                                            data-target="#instagramModal">
                                        View Data
                                    </button>

                                    {/*<a className="btn btn-primary" id="import-instagram-btn"
                                       href="import_instagram_files.html"
                                       style={{display: 'none'}}>
                                        <span style={{color: '#ffffff !important'}}>Import full data of Instagram</span></a>*/}


                                    {/*<div className="embed-responsive embed-responsive-16by9" style={{display: 'none'}}>
                                        <iframe className="embed-responsive-item"
                                                src="https://api.instagram.com/oauth/authorize/?client_id=4d13c46e2674470b8ca898b7aa7954b3&redirect_uri=https://c3web.io/beefree/import_instagram.html&response_type=token">
                                            Loading ...
                                        </iframe>
                                    </div>*/}
                                </div>
                            </div>

                        </div>
                        <div className="col-sm-4">

                            <div className="card">
                                <div className="card-header"><strong>Dropbox</strong></div>
                                <div className="card-body">
                                    <h5 className="card-title"></h5>
                                    <p className="card-text" id="dropbox-data">Dropbox is a file hosting service
                                        operated
                                        by the company
                                        Dropbox, Inc., headquartered in San Francisco, California.</p>
                                    <button className="btn btn-primary" id="view-dropbox-btn"
                                        //onClick="window.open('https://www.dropbox.com/oauth2/authorize?client_id=ycvhx8dgtp4y9ql&response_type=token&redirect_uri=https://c3web.io/beefree/import_dropbox.html','InstagramWindow', 'width=800, height=600');"
                                            onClick={this.connectDropbox}
                                    >
                                        View data
                                    </button>

                                    <a className="btn btn-primary" id="import-dropbox-btn"
                                       style={{display: 'none'}}>
                                        Import full data of Dropbox
                                    </a>


                                    <div className="embed-responsive embed-responsive-16by9" style={{display: 'none'}}>
                                        <iframe className="embed-responsive-item"
                                                src="https://www.dropbox.com/oauth2/authorize?client_id=ycvhx8dgtp4y9ql&response_type=token&redirect_uri=https://c3web.io/beefree/import_dropbox.html">
                                            Loading ...
                                        </iframe>
                                    </div>


                                </div>
                            </div>

                        </div>
                        <div className="col-sm-4">

                            <div className="card">
                                <div className="card-header">Google Drive</div>
                                <div className="card-body">
                                    <h5 className="card-title">Google Drive</h5>
                                    <p className="card-text">Google Drive is a file storage and synchronization service
                                        developed by Google.
                                        Launched on April 24, 2012.</p>
                                    <button
                                        disabled
                                        className="btn btn-primary" onClick={this.notImplemented}>
                                        <i>Coming Soon!</i>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>


                    <div className="row" style={{marginTop: 20}}>
                        <div className="col-sm-4">

                            <div className="card">
                                <div className="card-header">Youtube</div>
                                <div className="card-body">
                                    <h5 className="card-title">Youtube</h5>
                                    <p className="card-text" id="youtube-data">YouTube is an American video-sharing
                                        website headquartered
                                        in San Bruno, California - strarted in February 2005. </p>

                                    <button
                                        disabled
                                        className="btn btn-primary"
                                        //onClick="window.open('#','youtubeWindow', 'width=800, height=600');"
                                        onClick={this.notImplemented}>
                                        <i>Coming Soon!</i>
                                    </button>

                                </div>
                            </div>

                        </div>
                        <div className="col-sm-4">

                            <div className="card">
                                <div className="card-header">Facebook</div>
                                <div className="card-body">
                                    <h5 className="card-title">Facebook</h5>
                                    <p className="card-text">Facebook, Inc. is an American online social media and
                                        social
                                        networking service
                                        company based in Menlo Park, California.</p>
                                    <button
                                        disabled
                                        className="btn btn-primary"
                                        //onClick="window.open('','InstagramWindow', 'width=800, height=600');"
                                        onClick={this.notImplemented}>
                                        <i>Coming Soon!</i>
                                    </button>

                                </div>
                            </div>

                        </div>
                        <div className="col-sm-4">

                            <div className="card">
                                <div className="card-header">Twitter</div>
                                <div className="card-body">
                                    <h5 className="card-title">Twitter</h5>
                                    <p className="card-text">Twitter is an American online news and social networking
                                        service on which users
                                        post and interact with messages known as "tweets".</p>
                                    <button
                                        disabled
                                        className="btn btn-primary"
                                        onClick={this.notImplemented}>
                                        <i>Coming Soon!</i>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>


                    <footer className="pt-4 my-md-5 pt-md-5 border-top">
                        <div className="row">
                            <div className="col-12 col-md">
                                <small className="d-block mb-3 text-muted">&copy; BeeFree 2019</small>
                            </div>

                        </div>
                    </footer>
                </div>

            </Fragment>
        );
    }
}

export default Layout;
