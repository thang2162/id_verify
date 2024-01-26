import React from 'react';
import { StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const PageLoader = props => {
  return (
    <>
      <Spinner
        visible={props.isActive}
        textContent={props.message}
        textStyle={styles.spinnerTextStyle}
      />
    </>
  );
};

export default PageLoader;

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF',
  },
});