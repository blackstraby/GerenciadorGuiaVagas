import _ from "lodash";

export default function (errors) {
  const result = {};
  _.forEach(errors, (val, key) => {
    const realKey = key.split('.')
    result[realKey.pop()] = val.message;
  });
  return result;
}
