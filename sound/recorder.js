// Recording
let record = false;
let recorder;
let recording;

function rec(title) {
    record = !record;
    if (record) {
        console.log("RECORD!");
        recorder.record(recording);
    }
    else {
        console.log("SAVE!");
        recorder.stop();
        setTimeout(() => {
            save(recording, title + '-' + Date.now() + '.wav')
        }, 100);
    }
}

function init_rec() {
    recorder = new p5.SoundRecorder();
    recording = new p5.SoundFile();
    recorder.setInput();
}