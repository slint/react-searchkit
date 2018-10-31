import { connect } from '@app/store';
import { updateQueryAggregation } from '@app/state/actions';
import AggregatorComponent from './Aggregator';

const mapDispatchToProps = dispatch => ({
  updateQueryAggregation: (field, value) =>
    dispatch(updateQueryAggregation(field, value)),
});

export const Aggregator = connect(
  state => ({
    currentAggregations: state.query.aggregations,
    resultsAggregations: state.results.data.aggregations,
  }),
  mapDispatchToProps
)(AggregatorComponent);