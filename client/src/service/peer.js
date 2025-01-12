class PeerService {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });

      // Handle incoming tracks
      this.peer.ontrack = (event) => {
        console.log("Incoming track:", event.streams[0]);
        this.handleIncomingStream(event.streams[0]);
      };

      // Handle ICE candidates
      this.peer.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("New ICE Candidate:", event.candidate);
          // Implement signaling to send ICE candidates to remote peer
        }
      };
    }
  }

  // Handle incoming remote stream
  handleIncomingStream(stream) {
    const audioElement = document.getElementById("remote-audio");
    if (audioElement) {
      audioElement.srcObject = stream;
      audioElement.play();
    }
  }

  // Create an offer
  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }

  // Create an answer
  async getAnswer(offer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(answer));
      return answer;
    }
  }

  // Set the remote description
  async setLocalDescription(answer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }

  // Add local media stream with audio constraints
  async addLocalStream() {
    const constraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: false,
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      stream.getTracks().forEach((track) => this.peer.addTrack(track, stream));
      console.log("Local stream added:", stream);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }
}

export default new PeerService();
