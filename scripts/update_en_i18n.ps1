param()
$path = "c:\Users\JunWe\Downloads\project-bolt-github-qkwqvrr2\project\messages\en.json"

$jsonText = Get-Content -Raw $path
$json = $jsonText | ConvertFrom-Json

$pairs = [ordered]@{
  'ai.ai_powered' = 'AI-Powered'
  'ai.more' = 'more'

  'ai.tools.trading_assistant.title' = 'AI Trading Assistant'
  'ai.tools.trading_assistant.description' = 'Your personal AI trading companion that helps analyze markets and improve decisions'
  'ai.tools.trading_assistant.features.market_analysis' = 'Market analysis'
  'ai.tools.trading_assistant.features.trade_suggestions' = 'Trade suggestions'
  'ai.tools.trading_assistant.features.risk_management' = 'Risk management'
  'ai.tools.trading_assistant.features.performance_tracking' = 'Performance tracking'

  'ai.tools.economic_calendar.title' = 'Economic Calendar Analyzer'
  'ai.tools.economic_calendar.description' = 'AI-powered analysis of economic events and their potential market impact'
  'ai.tools.economic_calendar.features.impact_prediction' = 'Event impact prediction'
  'ai.tools.economic_calendar.features.historical_correlation' = 'Historical correlation analysis'
  'ai.tools.economic_calendar.features.custom_alerts' = 'Custom alerts'
  'ai.tools.economic_calendar.features.reaction_tracking' = 'Market reaction tracking'

  'ai.tools.forex_market_hours.title' = 'Forex Market Hours'
  'ai.tools.forex_market_hours.description' = 'View live forex session times in your local timezone. Detect overlaps and see which sessions are currently open.'
  'ai.tools.forex_market_hours.features.detect_overlaps' = 'Detect overlapping sessions'
  'ai.tools.forex_market_hours.features.current_open_sessions' = 'See current open sessions'
  'ai.tools.forex_market_hours.features.custom_alerts' = 'Custom alerts'
  'ai.tools.forex_market_hours.features.reaction_tracking' = 'Market reaction tracking'

  'ai.tools.market_sentiment_analyzer.title' = 'Market Sentiment Analyzer'
  'ai.tools.market_sentiment_analyzer.description' = 'Analyze market sentiment across social media and news using NLP'
  'ai.tools.market_sentiment_analyzer.features.social_media_tracking' = 'Social media sentiment tracking'
  'ai.tools.market_sentiment_analyzer.features.news_analysis' = 'News article analysis'
  'ai.tools.market_sentiment_analyzer.features.trend_visualization' = 'Sentiment trend visualization'
  'ai.tools.market_sentiment_analyzer.features.real_time_updates' = 'Real-time updates'

  'ai.tools.portfolio_optimizer.title' = 'AI Portfolio Optimizer'
  'ai.tools.portfolio_optimizer.description' = 'Optimize your trading portfolio using AI-driven risk management'
  'ai.tools.portfolio_optimizer.features.risk_adjusted_allocation' = 'Risk-adjusted allocation'
  'ai.tools.portfolio_optimizer.features.correlation_analysis' = 'Correlation analysis'
  'ai.tools.portfolio_optimizer.features.rebalancing_recommendations' = 'Rebalancing recommendations'
  'ai.tools.portfolio_optimizer.features.performance_projections' = 'Performance projections'

  'ai.tools.pattern_scanner.title' = 'Pattern Recognition Scanner'
  'ai.tools.pattern_scanner.description' = 'Automatically detect chart patterns and technical setups across multiple assets'
  'ai.tools.pattern_scanner.features.multi_timeframe_scanning' = 'Multi-timeframe scanning'
  'ai.tools.pattern_scanner.features.custom_pattern_definitions' = 'Custom pattern definitions'
  'ai.tools.pattern_scanner.features.alert_notifications' = 'Alert notifications'
  'ai.tools.pattern_scanner.features.historical_backtest' = 'Historical pattern backtest'

  'ai.tools.trading_signals.title' = 'AI Trading Signal Generator'
  'ai.tools.trading_signals.description' = 'Get real-time trading signals powered by advanced machine learning algorithms'
  'ai.tools.trading_signals.features.real_time_analysis' = 'Real-time market analysis'
  'ai.tools.trading_signals.features.multi_timeframe' = 'Multi-timeframe signals'
  'ai.tools.trading_signals.features.custom_alert_settings' = 'Customizable alert settings'
  'ai.tools.trading_signals.features.historical_performance' = 'Historical performance tracking'

  'ai.tools.trading_bots.title' = 'Automated Trading Bots'
  'ai.tools.trading_bots.description' = 'Deploy AI-powered trading bots that execute trades based on your custom strategies'
  'ai.tools.trading_bots.features.strategy_builder' = 'Strategy builder'
  'ai.tools.trading_bots.features.risk_settings' = 'Risk management settings'
  'ai.tools.trading_bots.features.performance_analytics' = 'Performance analytics'
  'ai.tools.trading_bots.features.multi_broker_integration' = 'Multiple broker integration'

  'ai.tools.news_predictor.title' = 'News Impact Predictor'
  'ai.tools.news_predictor.description' = 'Predict market movements based on breaking news using advanced NLP'
  'ai.tools.news_predictor.features.real_time_news' = 'Real-time news analysis'
  'ai.tools.news_predictor.features.impact_prediction' = 'Impact prediction'
  'ai.tools.news_predictor.features.historical_correlation' = 'Historical correlation'
  'ai.tools.news_predictor.features.alert_system' = 'Alert system'

  'ai.products.semi_auto_ea.title' = 'Semi Auto Trading EA'
  'ai.products.semi_auto_ea.description' = 'A Semi Auto Trading Expert Advisor (EA) combines automation with human control. It provides signals and entry suggestions while you make the final decision, reducing workload and improving accuracy.'

  'ai.products.full_auto_ea.title' = 'Full Auto Trading EA'
  'ai.products.full_auto_ea.description' = 'A fully automated EA that analyzes markets, identifies opportunities, and executes trades end-to-end with predefined risk management—eliminating emotional decisions for consistent performance.'

  'ai.products.proven_strategies_semi.title' = 'Proven Strategies Set Files (Semi-Auto)'
  'ai.products.proven_strategies_semi.description' = 'Ready-to-use, backtested set files tailored for semi-auto trading. Load and trade with confidence across different market conditions and account sizes.'
  'ai.products.proven_strategies_semi.bullets.0' = 'Save time with pre-optimized parameters'
  'ai.products.proven_strategies_semi.bullets.1' = 'Trade with confidence from tested setups'
  'ai.products.proven_strategies_semi.bullets.2' = 'Adaptable to market conditions and styles'
  'ai.products.proven_strategies_semi.bullets.3' = 'Increase consistency and reduce errors'

  'ai.products.proven_strategies_full.title' = 'Proven Strategies Set Files (Full-Auto)'
  'ai.products.proven_strategies_full.description' = 'Ready-to-use, backtested set files optimized for full-auto systems. Achieve consistency and efficiency with parameters refined for automated execution.'
  'ai.products.proven_strategies_full.bullets.0' = 'Pre-optimized for automated strategies'
  'ai.products.proven_strategies_full.bullets.1' = 'Stable performance from tested parameters'
  'ai.products.proven_strategies_full.bullets.2' = 'Adaptable to market regimes and styles'
  'ai.products.proven_strategies_full.bullets.3' = 'Reduce human error and improve consistency'

  'auth.close_login_modal' = 'Close login modal'
  'ai.ta.failed_to_load_history' = 'Failed to load history'
}

foreach ($k in $pairs.Keys) {
  $prop = $json.PSObject.Properties[$k]
  if ($prop) {
    $prop.Value = $pairs[$k]
  } else {
    $json | Add-Member -NotePropertyName $k -NotePropertyValue $pairs[$k] -Force
  }
}

$json | ConvertTo-Json -Depth 100 | Set-Content -Path $path -Encoding UTF8
