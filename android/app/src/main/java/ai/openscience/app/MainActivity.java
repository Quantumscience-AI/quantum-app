package ai.openscience.app;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onStart() {
    super.onStart();
    // Disable Android font scaling
    android.content.res.Configuration config = getResources().getConfiguration();
    config.fontScale = 1.0f;
    createConfigurationContext(config);
  }
}
