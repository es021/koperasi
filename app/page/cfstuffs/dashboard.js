import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dashboard, DashboardEnum } from '../../config/db-config';
import List from '../component/list';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import { Time } from '../lib/time';
import GeneralFormPage from '../component/general-form';
import { getAuthUser, getCF, isRoleOrganizer, isRoleAdmin } from '../redux/actions/auth-actions';
import obj2arg from 'graphql-obj2arg';
import { getDataCareerFair } from '../component/form';

require("../css/dashboard.scss");

export default class DashboardPage extends React.Component {
    constructor(props) {
        super(props);
        this.authUser = getAuthUser();
        this.CF = this.authUser.cf;
        console.log(this.CF);
        this.company_id = this.props.company_id;
    }

    componentWillMount() {

        this.successAddHandler = (d) => {
            emitLiveFeed(d.title, d.content, d.type, d.cf, Time.getUnixTimestampNow());
        };
        
        //##########################################
        // List data properties
        this.renderRow = (d) => {
            return [
                <td>{d.ID}</td>
                , <td>{d.cf}</td>
                , <td>{d.type}</td>
                , <td>
                    <b>{d.title}</b>
                    <p dangerouslySetInnerHTML={{ __html: d.content }}></p>
                </td>
                , <td>{Time.getString(d.created_at)}</td>
            ];
        };

        this.tableHeader = <thead>
            <tr>
                <th>ID</th>
                <th>Career Fair</th>
                <th>Sent To</th>
                <th>Announcement</th>
                <th>Sent At</th>
            </tr>
        </thead>;

        this.loadData = (page, offset) => {
            var param = {
                cf: this.CF,
                page: page,
                offset: offset
            };

            var query = `query{dashboards(${obj2arg(param, { noOuterBraces: true })})
            {ID title content cf type created_at}}`;
            return getAxiosGraphQLQuery(query);
        }

        // get actual data from loadData
        // can alter any data here too
        this.getDataFromRes = (res) => {
            return res.data.data.dashboards;
        }

        //##########################################
        // form operation properties

        // if ever needed
        // hook before submit
        this.formWillSubmit = (d, edit) => {
            return d;
        }

        this.getEditFormDefault = (ID) => {
            const query = `query{dashboard(ID:${ID}){ID title content type created_at}}`;
            return getAxiosGraphQLQuery(query).then((res) => {
                var data = res.data.data.dashboard;
                return data;
            });
        }

        // create form add new default
        this.newFormDefault = {};
        this.newFormDefault[Dashboard.CF] = this.CF;
        this.newFormDefault[Dashboard.CREATED_BY] = this.authUser.ID;


        this.getFormItem = (edit) => {
            var ret = [{ header: "Announcement Form" }];

            if (isRoleAdmin()) {
                ret.push({
                    label: "Select Career Fair",
                    name: Dashboard.CF,
                    type: "radio",
                    data: getDataCareerFair("login"),
                    required: true
                });
            } else {
                ret.push({
                    label: "CF",
                    name: Dashboard.CF,
                    type: "text",
                    disabled: true,
                    hidden: true,
                    required: (!edit)
                });
            }

            ret.push(...[
                {
                    label: "Send To",
                    name: Dashboard.TYPE,
                    type: "select",
                    required: true,
                    data: [DashboardEnum.TYPE_STUDENT, DashboardEnum.TYPE_RECRUITER]
                }, {
                    label: "Title",
                    name: Dashboard.TITLE,
                    type: "text",
                    placeholder: "",
                    required: true
                }, {
                    label: "Content",
                    sublabel: <div>To add link use syntax as the following<br></br>
                        {"<a target='_blank' href='https://www.url.com'>Click Here</a>"}
                    </div>,
                    name: Dashboard.CONTENT,
                    type: "textarea",
                    placeholder: "",
                    required: true
                }, {
                    label: "Created By",
                    name: Dashboard.CREATED_BY,
                    type: "number",
                    disabled: true,
                    hidden: true,
                    required: (!edit)
                }
            ]);

            return ret;
        }
    }

    render() {
        return <GeneralFormPage
            dataTitle="Live Feed Management"
            entity="dashboard"
            entity_singular="Announcement"
            addButtonText="Add New Announcement"
            dataOffset={10}
            tableHeader={this.tableHeader}
            newFormDefault={this.newFormDefault}
            getEditFormDefault={this.getEditFormDefault}
            getFormItem={this.getFormItem}
            renderRow={this.renderRow}
            getDataFromRes={this.getDataFromRes}
            loadData={this.loadData}
            successAddHandler={this.successAddHandler}
            formWillSubmit={this.formWillSubmit}
        ></GeneralFormPage>
    }
}