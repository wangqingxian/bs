<?php
defined('BASEPATH') OR exit('No direct script access allowed');
use League\Flysystem\Filesystem;
use League\Flysystem\Adapter\Local;
use League\Flysystem\Plugin\ListPaths;
class Welcome extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */
	public function __construct()
    {
        parent::__construct();
    }


    public function index()
	{
	    $this->load->config("aconfig.php");
	    $data=array();
	    $data["ac_title"]=$this->config->item("ac_title");
        $this->load->view("template/user_head.php",$data);
        $this->load->view("welcome/index.php");
        $this->load->view("template/foot.php");
	}

	function ttt()
    {
        //$this->load->view('welcome_message');
        $this->load->helper("array");
        //echo utf_substr("sdfgdhjhsaghjhsgdf",2);
        $provider = \probe\Factory::create();
        $interval=5;// 每隔5s运行


        function test ($provider) {
            //var_dump($provider->getCpuModel());
            var_dump($provider->getCpuUsage());
            var_dump($provider->getFreeMem());
            var_dump($provider->getCpuModel());
        }
        //test($provider);
        $this->config->load('ac');
        $svn=$this->config->item("svn_repository");
//        echo "svn=".$svn;
        var_dump($this->session->authorityData);
    }

	function test(){
	    $b=array('__halt_compiler', 'abstract', 'and', 'array', 'as',
            'break', 'callable', 'case', 'catch', 'class', 'clone',
            'const', 'continue', 'declare', 'default', 'die', 'do',
            'echo', 'else', 'elseif', 'empty', 'enddeclare', 'endfor',
            'endforeach', 'endif', 'endswitch', 'endwhile', 'eval', 'exit',
            'extends', 'final', 'for', 'foreach', 'function', 'global',
            'goto', 'if', 'implements', 'include', 'include_once',
            'instanceof', 'insteadof', 'interface', 'isset', 'list',
            'namespace', 'new', 'or', 'print', 'private', 'protected',
            'public', 'require', 'require_once', 'return', 'static', 'switch',
            'throw', 'trait', 'try', 'unset', 'use', 'var', 'while',
            'xor','__CLASS__', '__DIR__', '__FILE__', '__FUNCTION__',
            '__LINE__', '__METHOD__', '__NAMESPACE__', '__TRAIT__',
            "CI_Controller","Default","index","Authox_Controller","MY_Controller",
            "Api_Controller","CI_Model","MY_Model","Base_Model","Api_Model");
	    echo implode("|",$b);
    }

    function test1()
    {
        $this->load->helper('captcha');
        $vals = array(
            'img_path'  => FCPATH.'admin/captcha/',
            'img_url'   => ROOTURL.'admin/captcha/',
            'pool'      => '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',

        );

        $cap = create_captcha($vals);

        $data = array(
            'captcha_time'  => $cap['time'],
            'ip_address'    => $this->input->ip_address(),
            'word'      => strtolower($cap['word'])
        );

        $query = $this->db->insert_string('ac_captcha', $data);
        $this->db->query($query);

        echo 'Submit the word you see below:';
        echo $cap['image'];
        echo '<form action="test2"><input type="text" name="captcha" value="" /></form>';
        var_dump($cap);
    }

    function test2()
    {
        $expiration = time() - 7200; // Two hour limit
        $this->db->where('captcha_time < ', $expiration)
            ->delete('ac_captcha');

        // Then see if a captcha exists:
        $sql = 'SELECT COUNT(*) AS count FROM ac_captcha WHERE word = ? AND ip_address = ? AND captcha_time > ?';
        $binds = array($_GET['captcha'], $this->input->ip_address(), $expiration);
        $query = $this->db->query($sql, $binds);
        $row = $query->row();

        if ($row->count == 0)
        {
            echo 'You must submit the word that appears in the image.';
        }
        else
        {
            echo "true";
        }
    }

    function test3()
    {
        $adapter = new Local(APPPATH);
        $filesystem = new Filesystem($adapter);

        $contents = $filesystem->listContents("controllers",true);
        foreach ($contents as $object) {
            echo $object['basename'].' is located at'.$object['path'].' and is a '.$object['type']."<br>";
        }

        //$contents = $filesystem->deleteDir('path/to/directory');

        var_dump($contents);
        $a=array("dasd"=>"asd");
        $b="adssad";
        var_dump(empty($a["asdasd"]));
        var_dump(empty($b["asdasd"]));


    }

    function test4()
    {
        $this->load->model("test_model");
        $this->test_model->test();
        $arr=array(
            0=>array('title' => '新闻1', 'viewnum' => 123, 'content' => 'ZAQXSWedcrfv'),
            1=>array('title' => '新闻2', 'viewnum' => 99, 'content' => 'QWERTYUIOPZXCVBNM')
        );
        echo '不统计多维数组：'.count($arr,0);//count($arr,COUNT_NORMAL)
        echo "<br/>";
        echo '统计多维数组：'.count($arr,1);//count($arr,COUNT_RECURSIVE)
    }

    function test5()
    {
        $adapter = new Local(APPPATH);
        $filesystem = new Filesystem($adapter);
        var_dump($filesystem->has('models/base/user_model'));
        //$filesystem->rename("models/base/test","models/base/dasdadsa");
    }

    function test6   ()
    {
        //$this->load->view("login/index.php");
        var_dump($this->uri->segment(1));
        var_dump($this->uri->segment(2));
        var_dump($this->uri->segment(3));
    }

    function test7()
    {
$temp=<<<script
angular.module("moduleController")
.controller("testCtrl",function(\$scope){
    \$scope.test="adssssssss";
})
script;

    echo $temp;
    }

    function test8()
    {
        $this->load->view("welcome/test.php");
    }

    function test9()
    {
        echo "<?php echo 'asd' ?>";
    }
}
