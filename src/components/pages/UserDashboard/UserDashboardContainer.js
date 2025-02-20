import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  fetchSavedCity,
  unpinCity,
  fetchCityData,
} from '../../../state/actions';
import { Spin, notification } from 'antd';
import { Header, Footer } from '../../common/';
import RenderUserDashboard from './RenderUserDashboard';
const spinStyle = {
  textAlign: 'center',
  position: 'absolute',
  top: '46%',
  width: '100%',
  margin: 'auto',
};
const UserDashboardContainer = ({
  fetchSavedCity,
  savedCities,
  unpinCity,
  isFetching,
}) => {
  const { push } = useHistory();
  const cs = localStorage.getItem('cityAndState');
  console.log('cs', cs);
  const [cityAndState, setCityAndState] = useState(cs);
  useEffect(() => {
    fetchSavedCity(localStorage.getItem('token'));
    console.log('this is the fetch saved city', fetchSavedCity);
  }, [fetchSavedCity]);
  const deleteNotification = () => {
    notification.open({
      message: 'City Removed',
      description: `${cityAndState} has been removed from Pinned Cities.`,
    });
  };
  const handleRemoveCity = id => {
    unpinCity(localStorage.getItem('token'), id);
    deleteNotification();
    window.location.reload();
  };

  const handleOnCityClick = value => {
    localStorage.setItem('cityAndState', value);
    fetchCityData(value);
    push(`/citySearch/${value}`);
  };

  return (
    <>
      <Header />
      {isFetching ? (
        <div style={spinStyle}>
          <Spin tip="Loading..." size="large"></Spin>
        </div>
      ) : (
        <RenderUserDashboard
          savedCities={savedCities}
          handleRemoveCity={handleRemoveCity}
          handleOnCityClick={handleOnCityClick}
          id={localStorage.getItem('token')}
        />
      )}
      <Footer />
    </>
  );
};
const mapStateToProps = state => {
  return {
    isFetching: state.cityOperations.isFetching,
    error: state.cityOperations.error,
    savedCities: state.cityOperations.savedCities,
    isSaved: state.cityOperations.isSaved,
    cityData: state.cityData,
  };
};
export default connect(mapStateToProps, {
  fetchSavedCity,
  unpinCity,
})(UserDashboardContainer);
