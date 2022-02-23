import isEqual from 'lodash/isEqual';
import isUndefined from 'lodash/isUndefined';
import keys from 'lodash/keys';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';

import { when } from '../../../store';
import { routeQuery } from '../../../routes';
import { bind, call } from '../../../utils';
import { autoRedirect } from '../utils';
import { getCertificates} from '../../../api/certificate/actions';
import Checkbox from '../../inputs/checkbox/Checkbox';
import Confirm from '../../popups/Confirm';
import Filters from '../Filters';
import Icon from '../../utils/Icon';
import Paginate from '../../paginate/Paginate';
import Table from '../../table/Table';
import CertificatePopup from './CertificatePopup';

import './Certificate.scss';


import moment from 'moment'

import {
  createCertificate,
  updateCertificate,
  deleteCertificate
} from '../../../api/certificate/actions';

/**
 * Sort fields
 */
export const sortFields = {
  name: 'Name',
  ctype: 'Type',
  cid: 'Certificate ID'
};

/**
 * Sort keys
 */
export const sortKeys = keys(sortFields);

/**
 * Admin Certificates
 */
class Certificates extends Component {

  constructor(...args) {
    super(...args);

    bind(this, [
      'delete',
      'query'
    ]);
  }

  render() {
    const { certificates, route } = this.props;

    return (
      <div className="Certificates">
        <Filters
          create={{
            action: createCertificate,
            caption: '+ Add certificate',
            onSave: this.query,
            popup: CertificatePopup,
            title: 'Add certificate',
          }}
          route={route}
        />
        <Table {...certificates} route={route}>
          {() => ({
            head: ({ selected, sort, toggle }) => (
              <>
                <tr>
                  <th>
                    <Checkbox icon="fa-minus" value={selected} size="sm" onChange={call(toggle, !selected)}>
                      {selected ? 'Deselect' : 'Select'} All ({this.props.certificates.count})
                    </Checkbox>
                  </th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
                <tr>
                  <th></th>
                  {sortKeys.map((key) => (
                    <th key={key}>{sort(key, sortFields[key])}</th>
                  ))}
                  <th>Aml Name</th>
                  <th></th>
                  <th></th>
                </tr>
              </>
            ),
            row: (certificate, { odd, selected, toggle }) => {
              const { _id, name, ctype, type, cid, reference, aml_name } = certificate;

              if (certificate.products && certificate.products.length > 0) {
                certificate.products = certificate.products.map(x => {
                  let formattedProduct = {};
                  formattedProduct._id = x._id;
                  formattedProduct.value = x._id;
                  formattedProduct.label = x.name;
                  return formattedProduct;
                });
              }

              if (certificate.aircraft_makes && certificate.aircraft_makes.length > 0) {
                certificate.aircraft_makes = certificate.aircraft_makes.map(x => {
                  let formattedProduct = {};
                  formattedProduct._id = x._id;
                  formattedProduct.value = x._id;
                  formattedProduct.label = x.name;
                  return formattedProduct;
                });
              }

              if (certificate.approved_aircraft_makes && certificate.approved_aircraft_makes.length > 0) {
                certificate.approved_aircraft_makes = certificate.approved_aircraft_makes.map(x => {
                  let formattedProduct = {};
                  formattedProduct._id = x._id;
                  formattedProduct.value = x._id;
                  formattedProduct.label = x.name;
                  return formattedProduct;
                });
              }

              if (certificate.aircraft_models && certificate.aircraft_models.length > 0) {
                certificate.aircraft_models = certificate.aircraft_models;
              }

              return (
                <>
                  <tr className={clsx({ odd, selected })}>
                    <td>
                      <Checkbox value={selected} size="sm" onChange={call(toggle, !selected)} />
                    </td>
                    <td>
                    <CertificatePopup
                        action={updateCertificate}
                        data={certificate}
                        title="Edit certification"
                        onSave={this.query}>
                        {name || reference}
                        <Icon value="fal-edit" />
                      </CertificatePopup>
                    </td>
                    <td>{ctype || type}</td>
                    <td>{cid || '----'}</td>
                    <td>{aml_name || '----'}</td>
                    <td className="delete">
                      <Confirm
                        message="Are you sure you want to delete this certificate?"
                        ok={{ title: 'Delete Certificate' }}
                        onConfirm={call(this.delete, _id)}>
                        {({ show }) => (
                          <Icon value="fa-trash" onClick={show} />
                        )}
                      </Confirm>
                    </td>
                  </tr>
                </>
              );
            }
          })}
        </Table>
        <Paginate {...certificates} route={route} />
      </div>
    );
  }

  async componentDidMount() {
    this.query();
  }

  componentDidUpdate(props) {
    this.query(props);
    autoRedirect(this, 'certificates');
  }

  /**
   * Delete certificate
   */
  delete(_id) {
    when(deleteCertificate(_id)).
    then()
    .then(response => {
      this.props.dispatch(getCertificates());
    });
  }



  /**
   * Perform query
   */
  query(props) {
    const { query = {} } = this.props.route;
    if (isUndefined(props) || !isEqual(query, props.route.query)) {
      this.props.dispatch(getCertificates(query));
    }
  }

  postUpdate(){
    this.location.reload();
  }
}

export default connect(({ api: { certificate }, router }) => {
  return {
    certificates: certificate.certificates,
    route: routeQuery(router)
  };
})(Certificates);
