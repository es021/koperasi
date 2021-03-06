import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader } from '../../../component/loader';
import { getAxiosGraphQLQuery } from '../../../../helper/api-helper';
import { DocLinkEnum, UserEnum, LogEnum, PrescreenEnum } from '../../../../config/db-config';
import ProfileCard from '../../../component/profile-card';
import PageSection from '../../../component/page-section';
import { CustomList, createIconLink } from '../../../component/list';
import * as layoutActions from '../../../redux/actions/layout-actions';
import { isRoleRec, getAuthUser } from '../../../redux/actions/auth-actions';
import { addLog } from '../../../redux/actions/other-actions';
export function createUserMajorList(major) {
    var r = null;

    try {
        r = "";
        major = JSON.parse(major);
        major.map((d, i) => {
            if (i > 0) {
                r += ", ";
            }
            r += d;
        });
    } catch (err) { 
        r = major;
    }

    return r;

}
// isIconOnly will only consider label with label style set in DocLinkEnum
export function createUserDocLinkList(doc_links, student_id, alignCenter = true, isIconOnly = false, isSimple = false) {
    //document and link
    var ret = null;
    const onClickDocLink = () => {
        addLog(LogEnum.EVENT_CLICK_USER_DOC, student_id);
    };

    var dl = [];
    var doc_link = null;

    if (isIconOnly) {
        doc_links.map((d, i) => {
            if (d == null) return;

            var style = DocLinkEnum.LABEL_STYLE[d.label];
            if (style && dl.length < 4) {
                d.icon = style.icon;
                d.color = style.color;
                dl.push(d);
            }
        });
        ret = createIconLink("sm", dl, alignCenter, onClickDocLink, "No Document Or Links Uploaded");

    } else if (isSimple) {
        ret = doc_links.map((d, i) => {
            if (d == null) return;

            return <a target='_blank' href={`${d.url}`}>{`${d.label} `}</a>;
        });
    } else {
        dl = doc_links.map((d, i) => {
            if (d == null) return;

            var icon = (d.type === DocLinkEnum.TYPE_DOC) ? "file-text" : "link";
            return <span><i className={`fa left fa-${icon}`}></i>
                <a target='_blank' href={`${d.url}`}>{`${d.label} `}</a>
            </span>;
        });
        ret = <CustomList className={"label"}
            emptyMessage={"No Document Or Links Uploaded"}
            alignCenter={alignCenter} items={dl}
            onClick={onClickDocLink}>
        </CustomList>

    }


    return ret;
}

export default class UserPopup extends Component {
    constructor(props) {
        super(props)

        this.authUser = getAuthUser();

        this.state = {
            data: null,
            loading: true,
        }
    }

    componentWillMount() {
        var id = null;

        if (this.props.match) {
            id = this.props.match.params.id
        } else {
            id = this.props.id;
        }

        this.id = id;

        console.log("UserPage", "componentWillMount");
        var query = (this.props.role === UserEnum.ROLE_STUDENT)
            ? `query {
              user(ID:${id}) {
                ID
                user_email
                first_name
                last_name
                description
                role
                rec_position
                rec_company
                company{name}
                skills{label}
                doc_links{label url type}
                img_url
                img_pos
                img_size
                university
                phone_number
                graduation_month
                graduation_year
                available_month
                available_year
                major
                minor
                description
            }}`
            : `query {
              user(ID:${id}) {
                ID
                user_email
                first_name
                last_name
                description
                role
                img_url
                img_pos
                img_size
                rec_position
                rec_company
                company{name}
            }}`;

        getAxiosGraphQLQuery(query).then((res) => {
            this.setState(() => {
                return { data: res.data.data.user, loading: false }
            })
        });
    }

    getBasicInfo(d) {

        var items = [{
            label: "Email",
            icon: "envelope",
            value: d.user_email
        }];

        if (d.role === UserEnum.ROLE_STUDENT) {
            items.push({
                label: "Phone Number",
                icon: "phone",
                value: d.phone_number
            });

            // major --------------------------------
            var major = null;
            try {
                var list = JSON.parse(d.major);
                if (list.length > 0) {
                    major = <CustomList className="empty" items={list}></CustomList>
                }
            } catch (err) {
                major = d.major;
            }

            if (major !== null) {
                items.push({
                    label: "Major",
                    icon: "graduation-cap",
                    value: major
                });
            }

            // minor --------------------------------
            var minor = null;
            try {
                var list = JSON.parse(d.minor);
                if (list.length > 0) {
                    minor = <CustomList className="empty" items={list}></CustomList>
                }
            } catch (err) {
                minor = d.minor;
            }

            if (minor !== null) {
                items.push({
                    label: "Minor",
                    icon: "graduation-cap",
                    value: minor
                });
            }

            items.push(
                {
                    label: "University",
                    icon: "university",
                    value: d.university
                }, {
                    label: "Expected Graduation",
                    icon: "calendar",
                    value: `${d.graduation_month} ${d.graduation_year}`
                }, {
                    label: "Work Availability Date",
                    icon: "suitcase",
                    value: this.getWorkAvailable(d.available_month, d.available_year)
                });
        }

        return <CustomList className="icon" items={items}></CustomList>;
    }

    getWorkAvailable(m, y) {
        if (m) {
            if (m == y) {
                return m;
            } else {
                return `${m} ${y}`;
            }
        } else {
            return <span className="text-muted">Not Specified</span>;
        }

    }

    getRecruiterBody(user) {
        //about
        const basic = this.getBasicInfo(user);
        var pcBody = <div>
            <PageSection title="About" body={basic}></PageSection>
        </div>;

        return pcBody;
    }

    getStudentBody(user) {
        //about
        const basic = this.getBasicInfo(user);

        const doc_link = createUserDocLinkList(user.doc_links, this.id);

        // skill
        var s = user.skills.map((d, i) => d.label);
        const skills = <CustomList className="label" items={s}></CustomList>;

        var dl = null;
        var pcBody = <div>
            <PageSection title="" body={basic}></PageSection>
            <PageSection title="Document & Link" body={doc_link}></PageSection>
            <PageSection title="Skills" body={skills}></PageSection>
            {(user.description != "" && user.description != null) ?
                <PageSection title="About" body={<p>{user.description}</p>}></PageSection>
                : null
            }
        </div>;

        return pcBody;
    }

    render() {
        var id = null;
        var user = this.state.data;
        var view = null;
        if (this.state.loading) {
            view = <Loader size='3' text='Loading Student Information...'></Loader>
        } else {

            var pcBody = (this.props.role === UserEnum.ROLE_STUDENT)
                ? this.getStudentBody(user)
                : this.getRecruiterBody(user);

            view = <div>
                <ProfileCard type="student"
                    title={user.first_name} subtitle={user.last_name}
                    img_url={user.img_url} img_pos={user.img_pos} img_size={user.img_size}
                    body={pcBody}></ProfileCard>
            </div>;
        }

        return (view);
    }
};

UserPopup.propTypes = {
    id: PropTypes.number.isRequired,
    role: PropTypes.string
};

UserPopup.defaultProps = {
    role: UserEnum.ROLE_STUDENT
};