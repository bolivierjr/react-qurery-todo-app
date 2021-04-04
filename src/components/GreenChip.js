import { Chip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";

const GreenChip = withStyles({
  root: {
    backgroundColor: green[400],
  },
})((props) => <Chip color="default" {...props} />);

export default GreenChip;
