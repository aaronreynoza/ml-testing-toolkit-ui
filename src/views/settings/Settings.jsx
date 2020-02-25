/*!

=========================================================
* Argon Dashboard React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Button,
  Col,
} from "reactstrap";

import { Input, Checkbox, Divider, message, Tag, Icon } from 'antd';
import 'antd/dist/antd.css';

import Header from "components/Headers/Header.jsx";
import axios from 'axios';
import RulesEditor from '../rules/RuleEditor'
import RuleViewer from '../rules/RuleViewer'

class ParamInput extends React.Component {

  inputValue = null

  handleValueChange = (event) => {
    if ((typeof this.props.value) === 'boolean') {
      this.inputValue = event.target.checked
    } else {
      this.inputValue = event.target.value
    }
    this.props.onChange(this.props.itemKey, this.inputValue)
  }

  render() {
    return (
      <Row className="mb-4">
        <Col lg="4">
          <h4>{this.props.name}</h4>
        </Col>
        <Col lg="8">
          {
            (typeof this.props.value) === 'boolean'
            ? (
              <Checkbox checked={this.props.value} onChange={this.handleValueChange}></Checkbox>
            )
            : (
              <Input
                className="form-control-alternative"
                type="text"
                defaultValue={this.props.value}
                value={this.props.value}
                onChange={this.handleValueChange}
                disabled={false}
              />
            )
          }
        </Col>
      </Row>
    )
  }
}

class ConfigurationEditor extends React.Component {

  handleParamValueChange = (name, value) => {
    this.props.config[name] = value
    this.forceUpdate()
  }

  handleSave = () => {
    this.props.onSave(this.props.config)
  }

  render () {
    return (
      <>
      <Row>
        <Col className="mb-5 mb-xl-0" xl="12">
          <Card className="card-profile shadow">
            <CardHeader>
              <div className="d-flex float-right">
                <Button
                  className="float-right"
                  color="primary"
                  href="#pablo"
                  onClick={this.handleSave}
                  size="sm"
                >
                  Save
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <ParamInput name="Override with Environment Variables" itemKey="OVERRIDE_WITH_ENV" value={this.props.config.OVERRIDE_WITH_ENV} onChange={this.handleParamValueChange} />
              <Divider />
              <ParamInput name="Callback URL" itemKey="CALLBACK_ENDPOINT" value={this.props.config.CALLBACK_ENDPOINT} onChange={this.handleParamValueChange} />
              <ParamInput name="FSP ID" itemKey="FSPID" value={this.props.config.FSPID} onChange={this.handleParamValueChange} />
              <ParamInput name="Send Callback" itemKey="SEND_CALLBACK_ENABLE" value={this.props.config.SEND_CALLBACK_ENABLE} onChange={this.handleParamValueChange} />
              <ParamInput name="Validate Transfers with previous quote" itemKey="TRANSFERS_VALIDATION_WITH_PREVIOUS_QUOTES" value={this.props.config.TRANSFERS_VALIDATION_WITH_PREVIOUS_QUOTES} onChange={this.handleParamValueChange} />
              <ParamInput name="Enable Version Negotiation Support" itemKey="VERSIONING_SUPPORT_ENABLE" value={this.props.config.VERSIONING_SUPPORT_ENABLE} onChange={this.handleParamValueChange} />
            </CardBody>
          </Card>
        </Col>
      </Row>
      </>
    )
  }
}

class ParamView extends React.Component {

  render() {
    return (
      <Row className="mb-4">
        <Col lg="4">
          <h4>{this.props.name}</h4>
        </Col>
        <Col lg="8">
          {
            (typeof this.props.value) === 'boolean'
            ? this.props.value ? (<Icon type="check" />) : (<Icon type="close" />)
            : (
              <Tag color="red">{this.props.value}</Tag>
            )
          }
        </Col>
      </Row>
    )
  }
}

class ConfigurationViewer extends React.Component {

  render () {
    return (
      <>
      <Row>
        <Col className="mb-5 mb-xl-0" xl="12">
          <Card className="card-profile shadow">
            <CardBody>
              <ParamView name="Callback URL" value={this.props.config.CALLBACK_ENDPOINT} onChange={this.handleParamValueChange} />
              <ParamView name="FSP ID" value={this.props.config.FSPID} onChange={this.handleParamValueChange} />
              <ParamView name="Send Callback" value={this.props.config.SEND_CALLBACK_ENABLE} onChange={this.handleParamValueChange} />
              <ParamView name="Validate Transfers with previous quote" value={this.props.config.TRANSFERS_VALIDATION_WITH_PREVIOUS_QUOTES} onChange={this.handleParamValueChange} />
              <ParamView name="Enable Version Negotiation Support" value={this.props.config.VERSIONING_SUPPORT_ENABLE} onChange={this.handleParamValueChange} />
            </CardBody>
          </Card>
        </Col>
      </Row>
      </>
    )
  }
}

class Settings extends React.Component {

  constructor() {
    super();
    this.state = {
      userConfigRuntime: {},
      userConfigStored: {},
    };
  }

  componentDidMount() {
    this.getUserConfiguration()
  }

  getUserConfiguration = async () => {
    message.loading({ content: 'Getting user config ...', key: 'getUserConfigProgress' });
    const response = await axios.get("http://localhost:5050/api/config/user")
    const userConfigRuntime = response.data.runtime
    const userConfigStored = response.data.stored
    await this.setState(  { userConfigRuntime, userConfigStored } )
    message.success({ content: 'Loaded', key: 'getUserConfigProgress', duration: -1 });
  }

  handleSaveUserConfig = async (newConfig) => {
    message.loading({ content: 'Saving user config ...', key: 'saveUserConfigProgress' });
    await axios.put("http://localhost:5050/api/config/user", newConfig, { headers: { 'Content-Type': 'application/json' } })
    await this.getUserConfiguration()
    message.success({ content: 'Saved', key: 'saveUserConfigProgress', duration: 2 });
  }


  render() {
    var newFileName = ''
    var newFileNameErrorMessage = ''
    const newFileCreateConfirm = () => {
      // Validate filename format
      // TODO: Some additional validation for the filename format
      if (!newFileName.endsWith('.json')) {
        message.error('Filename should be ended with .json');
        return
      }

      if (/\s/.test(newFileName)) {
        message.error('Filename contains spaces');
        return
      }

      this.setState({ mode: null})
      this.handleNewRulesFileClick(newFileName)
    }

    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="mb-5 mb-xl-0" xl="4">
              <Card className="card-profile shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Runtime Configuration</h3>
                </CardHeader>
                <CardBody className="pt-0 pt-md-4">
                  <ConfigurationViewer config={this.state.userConfigRuntime} />
                </CardBody>
              </Card>
            </Col>
            <Col xl="8">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <h3 className="mb-0">Edit Configuration</h3>
                </CardHeader>
                <CardBody>
                  <ConfigurationEditor config={this.state.userConfigStored} onSave={this.handleSaveUserConfig} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Settings;
