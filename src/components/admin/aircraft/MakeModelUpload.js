import React, { Component } from 'react';
import { connect } from 'react-redux';

import { when } from '../../../store';
import { bind } from '../../../utils';
import {
  uploadAircraftMakeModelCsv
} from '../../../api/aircraft/actions';
import Button from '../../utils/Button';
import Upload from "../../inputs/upload/Upload";
import Alert from "../../utils/alert/Alert";

/**
 * Admin Aircraft Make Model Upload
 */
class MakeModelUpload extends Component {

  state = {
    csv: null,
    error: null,
    success: null,
    uploading: false
  };

  constructor(...args) {
    super(...args);
    bind(this, [
    ]);
  }

  onFileSelect = ({ target: { files } }) => {
    if (files.length) {
      this.setState({ csv: files[0] });
    }
  };

  uploadCsv = () => {
    if (!this.state.csv) {
      this.setState({
        error: 'please select csv file first!'
      });
      return;
    }
    if (this.state.uploading) {
      return;
    }
    this.setState({
      uploading: true
    }, () => {
      const formData = new FormData();

      formData.append('csv', this.state.csv);
      when(uploadAircraftMakeModelCsv(formData))
        .then(() => {
          this.setState({
            success: 'Records uploaded successfully',
            uploading: false
          }, () => {
            setTimeout(() => {
              this.setState({
                success: null
              })
            }, 10000);
          });
        })
        .catch(() => {
          this.setState({
            error: 'Error while uploading Make Model csv',
            uploading: false
          }, () => {
            setTimeout(() => {
              this.setState({
                error: null
              })
            }, 10000);
          });
        });
    });
  };

  render() {
    const {csv, error, success} = this.state;
    return (
      <div className="AircraftMakeModelCsv">
        <Upload
          onUpdate={this.onFileSelect}
          disabled={this.state.uploading}
          max={1}
          required
        >
          {csv?.name || <p className="upload-area-label">Select CSV file</p>}
        </Upload>
        {error && <Alert position="top-left">{error}</Alert>}
        {success && <Alert position="top-left" variant="green">{success}</Alert>}
        <div className="button-row">
          <Button
            className="reset-btn"
            variant="red"
            disabled={this.state.uploading}
            onClick={() => this.setState({ csv: null, error: null })}
          >Reset</Button>
          <Button
            className="save-btn"
            variant="dark-blue"
            onClick={this.uploadCsv}
            disabled={this.state.uploading}
          >Upload Now</Button>
        </div>
      </div>
    );
  }

  componentDidMount() {
  }
}

export default connect(({ api: { aircraft }, router }) => {
  return {
    uploadedCsvData: aircraft.makeModelCSV
  };
})(MakeModelUpload);
