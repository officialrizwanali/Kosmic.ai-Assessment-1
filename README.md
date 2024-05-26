# Video processing service


### System Capabilities

 System is capable of following operations with logging and validations on each step to handle edge cases to avoid system crashing (which can be enhanced). System is scalable, enhanceable and efficient enough.

- Video file uploading with integrity check
- Queue based video processing i.e. applying filters, resizing, converting to MP4
- Generating time based expire-able download link


***

**POSTMAN COLLECTION ATTACHED FOR SAMPLE**

**DEMO here:
https://www.loom.com/share/d1bb986a63bf4d2faad86ff030474fbe

***


### What system offers

As it's the API project, below are the endpoints offered by system to interact with system to allow user to interact with system.

- **POST `/video/upload` - to upload single video file**
  > Request 
    >> body as form-data with following fields

    | field | type | description |
    | ---- | ---- | ----------- |
    | video | File | a video file to upload |
    | checksum | text | SHA256 checksum of file |
    | checkFileUploadIntegrity | boolean | boolean to validate or not to validate checksum |

  > Response 
    >> returns the following values

    | Response | type | description | sample |
    | ---- | ---- | ----------- |----|
    | error | object | returns error message | `{ "error": "No file uploaded }`|
    | success | object| returns uploaded file name| `{ "filename": "1716650387876.mp4" }`|
 
- **POST `/video/process` - to start processing of file provided**
  > Request 
    >> body as JSON with following fields

    | field | type | description |
    | ---- | ---- | ----------- |
    | filename | string | name of input file, returned by upload endpoint |
    | effects | object | object with multiple boolean valued effects. Current supported are `grayscale`, `negate`, `sepia`, `blur` and `sharpen` |
    | dimensions | object | having integer valued `width` and `height` properties to resize the output file, provide both `null` to disable |
    | metadata | object | object with metadata properties, currently supported `title` and `description` only, both are strings, provide `null` to disable |
    | convertToMp4 | boolean | to convert final video to MP4 if not already |

  > Response 
    >> returns the following values

    | Response | type | description | sample |
    | ---- | ---- | ----------- |----|
    | error | object | returns error message | `{ "error": "File not found" }`|
    | success | object| returns jobID, message, file name| `{ "jobId": "28", "message": "Video added to the processing job queue", "outputFilename": "processed-1716724507780.mp4" }`|

 
- **GET `/video/process/progress/:jobId` - to get progress of processing of a video by job ID**
  > Request 
    >> path variable with following fields

    | field | type | description |
    | ---- | ---- | ----------- |
    | jobID | string | ID of job returned by processing endpoint |

  > Response 
    >> returns the following values

    | Response | type | description | sample |
    | ---- | ---- | ----------- |----|
    | error | object | returns error message | `{ "error": "Job is not in processing or has not been processed yet" }`|
    | success | object| returns jobID, progress, status| `{ "jobId": "4", "progress": 30, "state": "active" }`|
 
- **POST `/video/download/token` - to generate token time based token for file to download**
  > Request 
    >> body as JSON with following fields

    | field | type | description |
    | ---- | ---- | ----------- |
    | filename | string | name of file, returned by processing endpoint |

  > Response 
    >> returns the following values

    | Response | type | description | sample |
    | ---- | ---- | ----------- |----|
    | error | object | returns error message | `{ "error": "No filename provided" }`|
    | success | object| returns expire-able link to request file| `{ "downloadLink": "/video/download/257fb824853d0935ddce4cc11c7c01112e4e7c2a" }`|

 
- **GET `/video/download/:token` - to download file with link generated**
  > Request 
    >> path variable with following fields

    | field | type | description |
    | ---- | ---- | ----------- |
    | token | string | token from URL returned by generate download link endpoint |

  > Response 
    >> returns the following values

    | Response | type | description | sample |
    | ---- | ---- | ----------- |----|
    | error | object | returns error message | `{ "error": "File not found" }`|
    | success | file| returns video file requested| |



***


### Technical Implementation

An API with an architecture following controllers, services pattern.

Built as an ExpressJS API in NodeJS environment as per requirements, with following:

- A few endpoints created for uploading file, commanding to process file, generating a time-based expire-able download link and requesting the actual file to download.
- Used a few external / third party libraries for different purposes.
    - `Multer` - for file upload
    - `Bull` + `redis` - for queuing functionality
    - `@ffmpeg-installer/ffmpeg` + `fluent-ffmpeg` - for video processing
    - `Express` - for creating API
    - `dotenv` - to support .env file for sensitive data or config like defining PORT
    - `ESLint` + `Prettier` - for code errors + formatting
    - `Chalk` - for colored logging on console
    - `Nodemon` - for watching changed files and reloading app in dev mode
    - Other utils including `UUID`, `Lodash`, `get-video-duration`


***


### Code walkthrough

Below is the overall file structure and architecture of app defined briefly.

- `server.js` - the main entry file
    - responsible for base initialization and starting the express server
- `routes.js` - the main routing file
    - defines a few routes used for our video processing service
- `controllers` - defines functions used as the endpoints' handlers
    - functions + input parameter validations used for defined routes in routes.js files like storage-controller responsible to deal storage related endpoints
- `middlewares` - defines the middlewares used in app
    - it has defined 2 for our app, error middleware + multer setup for file uploading
- `services` - defines services used for specific purposes
    - e.g. queue.js service provides all required functions and functionality related to queue
    - and storage.js service provides related to files and directories
- `uploads/` - has/will have the uploaded and processed files
- `utils` - defines different utilities used for generic purposes


***


### How to setup + run

#### Pre-requisites:
- Must have NodeJS installed (I'm using v22)
- Must have installed redis server (used with Bull queues)
    - On Mac with following command
    
    ```bash
    brew install redis
    ```
    
    - check installation with following command
    
    ``` bash
    redis-server --version
    ```
    
    - ping as client with following
    
    ```bash
    redis-cli ping
    ```
    
    - Start the redis server
    
    ```bash
    redis-server
    ```

#### Run the project
- Install the dependencies with following command

```bash
npm install
```

- Create ".env" file if not already existent and define PORT OR fallback is 55766
- Run the app by following command

``` bash
npm start
```

OR in Dev mode

``` bash
npm run start:dev
```


***


### Limitations

As far as the system capabilities concern, **there's no limit**, but for development purposes and to have an idea about how and where to add limitations.

Below are the applied limitations.

- Input video file size limit **100 MB**
- Video duration limit is **300 seconds** i.e. 5 minutes
- Download link expiration limit is **1 hour**


# What's next for this service

There are plenty of ideas / suggestions I have for this app to extend to be a full blown professional app with a lot of enhanced capabilities.

Following is the list of them in brief / bullet points

- sockets
    - if there is frontend and connection via socket, then real time progress updates can be triggered
- we can implement advanced system to process the video files in following scenarios:
    - if available, process single and multiple files on multi cores of processors / CPUs instead of single; NodeJS has capability to configure it easily.
    - we can go parallel or concurrent based on our needs, to process single and multiple files
    - we can divide / split large video files in smaller chunks, process them separately and combine at end
    - we can process on GPU, if available, setup and capabilities depend w.r.t GPU and OS, different configurations required.
- We can implement cluster for processing Queue jobs in parallel or concurrent via child processes.

Last, Not the least,
Thank you!


