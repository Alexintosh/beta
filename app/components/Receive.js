import React, { Component } from "react";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import { shell } from "electron";
import neoLogo from "../img/neo.png";
import copyIcon from "../images/copy-icon.png";
import printIcon from "../images/print-icon.png";
import emailIcon from "../images/email-icon.png";
import linkIcon from "../images/link-icon.png";
import TopBar from "./TopBar";
import Assets from "./Assets";
import ReactTooltip from "react-tooltip";

const getLink = (net, address) => {
	let base;
	if (net === "MainNet") {
		base = "https://neotracker.io/address/";
	} else {
		base = "https://testnet.neotracker.io/address/";
	}
	return base + address;
};

const openExplorer = srcLink => {
	shell.openExternal(srcLink);
};

const { dialog } = require("electron").remote;
const saveKeyRecovery = keys => {
  const content = JSON.stringify(keys);
  dialog.showSaveDialog(
    {
      filters: [
        {
          name: "JSON",
          extensions: ["json"]
        }
      ]
    },
    fileName => {
      if (fileName === undefined) {
        console.log("File failed to save...");
        return;
      }
      // fileName is a string that contains the path and filename created in the save file dialog.
      fs.writeFile(fileName, content, err => {
        if (err) {
          alert("An error ocurred creating the file " + err.message);
        }
        alert("The file has been succesfully saved");
      });
    }
  );
};

const loadKeyRecovery = dispatch => {
  dialog.showOpenDialog(fileNames => {
    // fileNames is an array that contains all the selected
    if (fileNames === undefined) {
      console.log("No file selected");
      return;
    }
    const filepath = fileNames[0];
    fs.readFile(filepath, "utf-8", (err, data) => {
      if (err) {
        alert("An error ocurred reading the file :" + err.message);
        return;
      }
      const keys = JSON.parse(data);
      storage.get("keys", (error, data) => {
        _.each(keys, (value, key) => {
          data[key] = value;
        });
        dispatch(setKeys(data));
        storage.set("keys", data);
      });
    });
  });
};

class Receive extends Component {
	render() {
		console.log(this.props.net);
		return (
			<div id="" className="">
				<Assets />
				<div className="dash-chart-panel">
					<div className="">
						<div className="col-xs-10">
							<img
								src={neoLogo}
								alt=""
								width="38"
								className="neo-logo logobounce"
							/>
							<h2>Receive Neo/Gas and NEP Tokens</h2>
						</div>

						<div className="col-xs-2 top-20 center com-soon">
        Block: {this.props.blockHeight}
						</div>
						<hr className="dash-hr-wide" />
						<div className="clearboth" />
						<div className="col-xs-4 top-20">
							<div
								className="addressBox-send center animated fadeInDown pointer"
								data-tip
								data-for="qraddTip"
								onClick={() => clipboard.writeText(this.props.address)}
							>
								<QRCode size={150} className="neo-qr" value={this.props.address} />
								<ReactTooltip
									className="solidTip"
									id="qraddTip"
									place="top"
									type="light"
									effect="solid"
								>
									<span>Click to copy your NEO Address</span>
								</ReactTooltip>
							</div>
						</div>

						<div className="col-xs-8">
							<h5>Your Public Address</h5>
							<input
								className="ledger-address top-10"
								onClick={() => clipboard.writeText(this.props.address)}
								id="center"
								placeholder={this.props.address}
								value={this.props.address}
							/>
							<div className="clearboth" />
							<div className="dash-bar top-30">
								<div
									className="dash-icon-bar"
									onClick={() => clipboard.writeText(this.props.address)}
								>
									<div className="icon-border">
										<span className="glyphicon glyphicon-duplicate" />
									</div>
                Copy Public Address
								</div>

								<div
									className="dash-icon-bar"
									onClick={() => print()}
								>
									<div className="icon-border">
										<span className="glyphicon glyphicon-print" />
									</div>
                Print Public Address
								</div>

								<div
									className="dash-icon-bar"
									onClick={() =>
										openExplorer(getLink(this.props.net, this.props.address))
									}
								>
									<div className="icon-border">
										<span className="glyphicon glyphicon-link" />
									</div>
                View On Blockchain
								</div>

								<div
									className="dash-icon-bar"
								>
									<div className="icon-border">
										<span className="glyphicon glyphicon-save" />
									</div>
                Download Encrypted Key
								</div>


							</div>



						</div>
					</div>
					<div className="clearboth" />
				</div>
				<div className="clearboth" />
				<div className="col-xs-12">
					<p className="send-notice">
          Your NEO address above can be used to receive all NEP5 tokens. All NEO and GAS transactions are FREE. Only send NEO, GAS or NEP tokens to a NEO address. Sending funds other than NEO, GAS or NEP tokens to the address above may result in those funds being lost.
					</p>

				</div>

			</div>
		);
	}
}

const mapStateToProps = state => ({
	blockHeight: state.metadata.blockHeight,
	net: state.metadata.network,
	address: state.account.address,
	neo: state.wallet.Neo,
	price: state.wallet.price,
	gas: state.wallet.Gas
});

Receive = connect(mapStateToProps)(Receive);
export default Receive;
