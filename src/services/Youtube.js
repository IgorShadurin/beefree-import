import React, {Component} from 'react';

class Youtube extends Component {
    constructor(props) {
        super(props);
        this.GoogleAuth = null;
        this.isAuthorized = false;

        //document.write('<script async defer src="https://apis.google.com/js/api.js" onload="this.onload=function(){};handleClientLoad()" onreadystatechange="if (this.readyState === \'complete\') this.onload()"></script>');
        window.gapi.load("client:auth2", function () {
            window.gapi.auth2.init({client_id: "840608930739-vcchqgf2kvl1t7ps36ivt2utakk882r3.apps.googleusercontent.com"});
        });
    }

    onViewData = () => {
        //this.handleClientLoad();
        this.authenticate().then(this.loadClient)
            .then(this.execute);
    };

    authenticate = () => {
        return window.gapi.auth2.getAuthInstance()
            .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
            .then(function () {
                    console.log("Sign-in successful");
                },
                function (err) {
                    console.error("Error signing in", err);
                });
    };
    loadClient = () => {
        window.gapi.client.setApiKey("AIzaSyD1JjCTzW1QATo354cX5kpJWtx1JBfyd-4");
        return window.gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
            .then(function () {
                    console.log("GAPI client loaded for API");
                },
                function (err) {
                    console.error("Error loading GAPI client for API", err);
                });
    };
    // Make sure the client is loaded and sign-in is complete before calling this method.
    execute = () => {
        return window.gapi.client.youtube.channels.list({
            "part": "snippet,contentDetails,statistics",
            "mine": true
        })
            .then(function (response) {
                    // Handle the results here (response.result has the parsed body).
                    console.log("Response", response);
                },
                function (err) {
                    console.error("Execute error", err);
                });
    };


    /**
     * Load the API's client and auth2 modules.
     * Call the initClient function after the modules load.
     */
    handleClientLoad = () => {
        window.gapi.load('client:auth2', this.initClient);
    };

    initClient = (event) => {
        // Initialize the gapi.client object, which app uses to make API requests.
        // Get API key and client ID from API Console.
        // 'scope' field specifies space-delimited list of access scopes
        window.gapi.client.init({
            'clientId': '840608930739-12c2gdat8sefu73ddbos0ci7i3dk0qa4.apps.googleusercontent.com',
            'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
            'scope': 'https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner'
        }).then(() => {
            this.GoogleAuth = window.gapi.auth2.getAuthInstance();
            // Listen for sign-in state changes.
            this.GoogleAuth.isSignedIn.listen(this.updateSigninStatus);
            // Handle initial sign-in state. (Determine if user is already signed in.)
            this.setSigninStatus();
            // Call handleAuthClick function when user clicks on "Authorize" button.
            /*$('#execute-request-button').click(function () {
                $('#youtubeImportContent').html('<div class="col-sm-2 offset-sm-5"><div class="loader-animation"></div></div>');
                handleAuthClick(event);
            });*/
            this.handleAuthClick(event);
        });
    };

    handleAuthClick = (event) => {
        // Sign user in after click on auth button.
        if (this.isAuthorized) {
            this.defineRequest();
        } else {
            this.GoogleAuth.signIn();
        }
    };

    setSigninStatus = () => {
        var user = this.GoogleAuth.currentUser.get();
        this.isAuthorized = user.hasGrantedScopes('https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner');
        // Toggle button text and displayed statement based on current auth status.
        if (this.isAuthorized) {
            //defineRequest();
        }
    };

    updateSigninStatus = (isSignedIn) => {
        this.setSigninStatus();
    };

    createResource = (properties) => {
        var resource = {};
        var normalizedProps = properties;
        for (var p in properties) {
            var value = properties[p];
            if (p && p.substr(-2, 2) == '[]') {
                var adjustedName = p.replace('[]', '');
                if (value) {
                    normalizedProps[adjustedName] = value.split(',');
                }
                delete normalizedProps[p];
            }
        }
        for (var p in normalizedProps) {
            // Leave properties that don't have values out of inserted resource.
            if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
                var propArray = p.split('.');
                var ref = resource;
                for (var pa = 0; pa < propArray.length; pa++) {
                    var key = propArray[pa];
                    if (pa == propArray.length - 1) {
                        ref[key] = normalizedProps[p];
                    } else {
                        ref = ref[key] = ref[key] || {};
                    }
                }
            }
        }
        return resource;
    };

    removeEmptyParams = (params) => {
        for (var p in params) {
            if (!params[p] || params[p] == 'undefined') {
                delete params[p];
            }
        }
        return params;
    };

    executeRequest = (request, onSuccess) => {
        request.execute(function (response) {
            console.log(response);
            if (onSuccess) {
                onSuccess(response);
            }
        });
    };

    buildApiRequest = (requestMethod, path, params, properties, onSuccess) => {
        params = this.removeEmptyParams(params);
        var request;
        if (properties) {
            var resource = this.createResource(properties);
            request = window.gapi.client.request({
                'body': resource,
                'method': requestMethod,
                'path': path,
                'params': params
            });
        } else {
            request = window.gapi.client.request({
                'method': requestMethod,
                'path': path,
                'params': params
            });
        }
        this.executeRequest(request, onSuccess);
    };

    defineRequest = () => {
        this.buildApiRequest('GET',
            '/youtube/v3/playlists',
            {
                'mine': 'true',
                'maxResults': '25',
                'part': 'snippet,contentDetails',
                'onBehalfOfContentOwner': '',
                'onBehalfOfContentOwnerChannel': ''
            }, null, (response) => {
                /*let youtubeImportContent = $('#youtubeImportContent');
                youtubeImportContent.html('<ul id="preview-youtube-playlists" class="list-inline">');
                response.items.forEach(function (v) {
                    youtubeImportContent.append('<li class="list-inline-item"><p><img src="' + v.snippet.thumbnails.medium.url + '"></p>' +
                        '<p><button type="button" class="btn btn-primary receive-youtube-playlist-videos" data-id="' + v.id + '">Receive videos</button></p>' +
                        '</li>');
                });
                youtubeImportContent.append('</ul>');*/
            });
    };

    /*$('#youtubeImportModal').on('click', '.receive-youtube-playlist-videos', function () {
        let id = $(this).attr('data-id');
        if (!id) {
            alert('Incorrect playlist id');
            return;
        }
        $('#youtubePlaylistVideos').html('<div class="col-sm-2 offset-sm-5"><div class="loader-animation"></div></div>');
        buildApiRequest('GET',
            '/youtube/v3/playlistItems',
            {
                'maxResults': '25',
                'part': 'snippet,contentDetails',
                'playlistId': id
            }, null, function (response) {
                let videos = $('#youtubePlaylistVideos');
                videos.html('<p><button type="button" class="btn btn-success btn-import-all-videos">Import all videos</button></p>' +
                    '<ul id="preview-youtube-videos" class="list-inline">');
                response.items.forEach(function (v) {
                    videos.append('<li class="list-inline-item youtube-video-import" data-id="' + v.contentDetails.videoId + '" data-cover-file="' + v.snippet.thumbnails.medium.url + '"><p><img src="' + v.snippet.thumbnails.medium.url + '"></p>' +
                        '</li>');
                });
                videos.append('</ul>');
            });
    });*/

    render() {
        return (
            <div className="col-sm-4">
                <div className="card">
                    <div className="card-header">Youtube</div>
                    <div className="card-body">
                        <h5 className="card-title">Youtube</h5>
                        <p className="card-text" id="youtube-data">YouTube is an American video-sharing
                            website headquartered
                            in San Bruno, California - strarted in February 2005. </p>

                        <button
                            className="btn btn-primary"
                            //onClick="window.open('#','youtubeWindow', 'width=800, height=600');"
                            onClick={this.onViewData}>
                            Coming Soon!
                        </button>

                    </div>
                </div>

            </div>
        );
    }
}

export default Youtube;
