const Instances = 8;
const ShardsPerCluster  = 4;
const TotalShards  = Instances*ShardsPerCluster;  

const PLX = {
  name: "AXONCORE",
  exec_mode: "fork",
  script: "index.js",
  cwd: "src",
  instance_var: 'CLUSTER_ID',
  instances: Instances,
  args: "--color --expose-gc",
  node_args: "-r esm --harmony --expose-gc --max_old_space_size=1024",
  env: {
    NODE_ENV: 'dev',
    TOTAL_SHARDS: TotalShards,
    SHARDS_PER_CLUSTER: ShardsPerCluster
  }
}
const apps = [ PLX ];
module.exports = { apps };
