import { Scrollbars } from 'react-custom-scrollbars';

const renderThumb = ({ style, ...props }) => {
  const thumbStyle = {
    borderRadius: 6,
    // backgroundColor: 'rgba(35, 49, 86, 0.8)',
  };
  return <div style={{ ...style, ...thumbStyle }} className={["bg-secondary bg-opacity-50"].join(' ')} {...props} />;
};

const CustomScrollbars = props => (
  <Scrollbars
    renderThumbHorizontal={renderThumb}
    renderThumbVertical={renderThumb}
    {...props}
  />
);

export default CustomScrollbars;
