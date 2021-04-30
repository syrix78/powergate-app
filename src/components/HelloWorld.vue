//https://github.com/felixniemeyer/example-powergate-web-app
<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/filecoin-logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class=text-center>
        <h1 class="display-2 text-decoration-underline font-weight-bold mb-3">
          IFT6056: BLOCKCHAIN AND ITS APPLICATIONS
        </h1>

        <p class="subheading font-weight-regular">
          A prototype for a decentralized storage client app using the
          <a href="https://docs.textile.io/powergate/">Powergate API</a>,
          <br />By Lucas Hornung and Quentin Wolak
        </p>

        <div class="chapter" v-if="this.$store.state.userToken !== ''">
          <h2 class="text-decoration-underline">User Info</h2>
          <p>token: {{ this.$store.state.userToken }}</p>
          <h3>Addresses</h3>
          <p v-for="(addr, i) in this.$store.state.addresses" :key="i">
            {{ addr.name }}: {{ addr.address }}
            <br> Balance: {{addr.balance}} <b>attoFIL</b>
          </p>
          
          <h3>Config</h3>
          <p>
            For more information about storage config, please visit
            <a
              href="https://docs.textile.io/powergate/storageconfig/#storageconfig-details"
              target="_blank"
            >
              this link </a
            >.
          </p>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header> Config File </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div ref="defaultConfig" class="json">
                  {{ this.$store.state.defaultConfig }}
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-btn color="primary" elevation="2" @click="$router.push('config')"
            >Edit Config</v-btn
          >
        </div>
        <v-divider></v-divider>
        <div class="chapter" v-if="this.$store.state.userToken !== ''">
          <h2 class="text-decoration-underline">Persist a File</h2>
          <h3>choose a file from your computer</h3>
          <p>choose file: <input ref="file" type="file" /></p>
          <p>
            When connecting to a powergate localnet, make sure the file has a
            valid size. Too small and too big files won't work. There is an
            explanation
            <a
              href="https://docs.textile.io/powergate/localnet/#localnet-features"
            >
              in the docs.
            </a>
          </p>
          <v-btn
            color="primary"
            elevation="2"
            @click="persist"
            :disabled="this.$store.state.userToken == ''"
          >
            persist file
          </v-btn>
        </div>
        <v-divider v-if="jobs.length > 0"></v-divider>
        <div class="chapter" v-if="jobs.length > 0">
          <h2 class="text-decoration-underline">Jobs</h2>
          <div class="job" v-for="job in jobs" :key="job.id">
            <div class="side right">
              <v-card class="mx-auto" max-width="344">
                <v-card-text>
                  <p class="display-1 text--primary">{{ job.filename }}</p>
                  <p>
                    Please take note of the following file id. The file name is
                    not saved by the network.
                  </p>
                  <div class="text--primary">
                    File ID: <b>{{ job.cid }}</b>
                  </div>
                </v-card-text>
                <v-card-actions class="justify-center">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                    v-if="job.status == 'Executing'"
                  >
                  </v-progress-circular>
                  <b v-if="job.status != 'Executing'">{{ job.status }}</b>
                  <span v-if="job.details !== ''">({{ job.details }})</span>
                </v-card-actions>
              </v-card>
            </div>
          </div>
        </div>
        <v-divider v-if="this.$store.state.userToken !== ''"></v-divider>
        <v-btn v-if="this.$store.state.userToken !== ''" elevation="2" @click="updateData"> Show Files </v-btn>
        <div v-if="storageList.length > 0" class="chapter">
          
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">CID</th>
                  <th class="text-left">Price per epoch</th>
                  <th class="text-left">Duration (In epochs)</th>

                  <th class="text-left">Download</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="data in storageList" :key="data">
                  <td class="text-left">{{ data.rootCid }}</td>
                  <td class="text-left">{{ data.dealInfo.pricePerEpoch }}</td>
                  <td class="text-left">{{ data.dealInfo.duration }}</td>
 
                  <td class="text-left">
                    <v-btn
                      depressed
                      color="primary"
                      @click="downloadData(data.rootCid)"
                      >Download</v-btn
                    >
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { powTypes } from "@textile/powergate-client";

export default {
  name: "HelloWorld",

  data: function () {
    return {
      grpcWebProxyAddress: "http://0.0.0.0:6002",
      pow: this.$store.getters.getPow,
      userToken: "",
      addresses: this.$store.getters.getAddresses,
      buildInfo: "",
      defaultConfig: this.$store.getters.getConfigText,
      jobs: [],
      watchingJobs: false,
      storageList: [],
    };
  },

  methods: {
    // set or create user
    setUser() {
      this.$router.push("login");
    },
    createUser() {
      this.pow.admin.users.create().then((res) => {
        if (res.user) {
          this.setUserToken(res.user.token);
        }
      }, console.error);
    },

    getUser() {
      return this.$store.state.userToken;
    },

    setUserToken(token) {
      this.userToken = token;
      this.$store.commit("setUserToken", token);
      this.pow.setToken(token);
      this.loadUserInfo();
    },
    // user info
    loadUserInfo() {
      this.addresses = [];
      this.defaultConfig = "";
      this.pow.wallet.addresses().then((v) => {
        this.addresses = v.addressesList;
      }, console.error);
      this.pow.storageConfig.default().then((v) => {
        this.defaultConfig = JSON.stringify(v.defaultStorageConfig, null, 2);
      });
    },

    // persist a file
    persist() {
      let files = this.$refs.file.files;
      if (files !== null && files.length >= 1) {
        const file = files[0];
        this.stageFile(file).then(
          (cid) => {
            this.applyConfig(cid, file.name);
          },
          (err) => {
            console.error("failed to stage file:", err);
          }
        );
      } else {
        console.error("could not persist, no file selected");
      }
    },
    stageFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
          if (reader.result instanceof ArrayBuffer) {
            const buffer = new Uint8Array(reader.result);
            this.pow.data.stage(buffer).then((v) => {
              resolve(v.cid);
            }, reject);
          } else {
            reject(Error(`reader.result is no ArrayBuffer`));
          }
        };
        reader.onerror = () => {
          reject(Error(`reading file as array buffer failed ${reader.error}`));
        };
      });
    },
    applyConfig(cid, filename) {
      this.pow.storageConfig.apply(cid).then((v) => {
        let job = {
          cid,
          filename,
          id: v.jobId,
          status: "created",
          details: "",
        };
        this.jobs.push(job);
        this.watchJobs();
      }, console.error);
    },
    watchJobs() {
      if (!this.watchingJobs) {
        this.watchingJobs = true;
        this.pow.storageJobs.watch((v) => {
          this.jobs.forEach((job) => {
            if (job.id == v.id) {
              this.updateJob(job, v);
            }
          });
        });
      }
    },
    updateJob(job, v) {
      console.log("job update", v);
      switch (v.status) {
        case powTypes.JobStatus.JOB_STATUS_EXECUTING:
          job.status = "Executing";
          break;
        case powTypes.JobStatus.JOB_STATUS_QUEUED:
          job.status = "Queued";
          break;
        case powTypes.JobStatus.JOB_STATUS_CANCELED:
          job.status = "Cancelled";
          break;
        case powTypes.JobStatus.JOB_STATUS_FAILED:
          job.status = "Failed";
          job.details = v.errorCause;
          this.removeJob(v.cid);
          break;
        case powTypes.JobStatus.JOB_STATUS_SUCCESS:
          job.status = "Succeeded";
          break;
      }
    },

    removeJob(cid) {
      var new_config = this.$store.getters.getConfig;
      new_config.hot.enabled = false;
      new_config.cold.enabled = false;

      this.pow.storageConfig
        .apply(cid, { storageConfig: new_config, override: true })
        .then((PromiseState) => {
          console.log("hello1");
          console.log(PromiseState);
        })
        .catch((error) => {
          console.log(error);
        });

      this.pow.storageConfig
        .remove(cid)
        .then((PromiseState) => {
          console.log("hello2");
          console.log(PromiseState);
        })
        .catch((error) => {
          console.log(error);
        });

      new_config.hot.enabled = true;
      new_config.cold.enabled = true;
    },

    updateData() {
      this.pow.deals.storageDealRecords({ includeFinal: true }).then((data) => {
        this.storageList = JSON.parse(JSON.stringify(data.recordsList));

     
      });
      console.log(this.storageList[0]);
      console.log(this.pow.storageJobs.list())
    },
    /*
    removeData(cid) {
      console.log(cid);
      this.removeJob(cid);
      this.pow.data.cidInfo(cid).catch((error) => {
        console.log(error);
      });
    },*/

    downloadData(cid) {
      console.log(cid);
      this.pow.data
        .get(cid)
        .then((PromiseState) => {
          console.log("hello5");
          console.log(PromiseState);
          var downloadBlob, downloadURL;

          downloadBlob = function (data, fileName, mimeType) {
            var blob, url;
            blob = new Blob([data], {
              type: mimeType,
            });
            url = window.URL.createObjectURL(blob);
            downloadURL(url, fileName);
            setTimeout(function () {
              return window.URL.revokeObjectURL(url);
            }, 1000);
          };

          downloadURL = function (data, fileName) {
            var a;
            a = document.createElement("a");
            a.href = data;
            a.download = fileName;
            document.body.appendChild(a);
            a.style = "display: none";
            a.click();
            a.remove();
          };

          downloadBlob(PromiseState, cid, { type: "application/octet-binary" });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.json {
  display: inline-block;
  white-space: pre-wrap;
  background-color: #444;
  color: #eee;
  text-align: left;
  font-family: monospace;
  font-size: 0.9em;
  padding: 0.4em;
  border-radius: 0.4em;
}

input,
button,
div {
  margin: 0.4em;
}
</style>
