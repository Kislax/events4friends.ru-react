import React, { Component } from 'react';
import ServiceCard from '../components/ServiceCard';
import ButtonLink from '../components/ButtonLink';
import { DataContext } from '../context/DataContext'
import './ServicesView.css';
import ServiceSort from '../components/ServiceSort';

class ServicesView extends Component {
  displayService(service) {
    if (!service) {
      return null;
    }
    
    return (
      <div key={service.id}>
        <ServiceCard
          service={service}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="main-view">
        <div>
          <ButtonLink 
            to="/" 
            icon="/icons/icon_arrow_back.png"
            title="На главную"
            style={{ 
              width: 175,
              display: 'block',
              marginRight: 'auto',
              marginLeft: 'auto',
              marginBottom: 10,
              borderColor: 'rgba(77, 77, 77, .2)'
            }}
          />
        </div>
        <ServiceSort />
        <div className="pt-3">
          <DataContext.Consumer>
            {({ services }) => {
              return services.map(service => this.displayService(service))
            }}
          </DataContext.Consumer> 
        </div>
      </div>
    )
  }
}

export default ServicesView;
