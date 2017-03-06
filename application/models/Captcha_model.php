<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Captcha_model extends Base_Model {
	public function __construct() {
		$this->table_name = 'captcha';
		parent::__construct();
	}

	function create()
    {
        $this->load->helper('captcha');
        $vals = array(
            'img_path'  => FCPATH.'admin/captcha/',
            'img_url'   => ROOTURL.'admin/captcha/',
            'pool'      => '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
        );

        if($cap = create_captcha($vals))
        {
            $data = array(
                'captcha_time'  => $cap['time'],
                'ip_address'    => $this->input->ip_address(),
                'word'      => strtolower($cap['word'])
            );

            if($this->save_captcha($data))
            {
                return $cap['image'];
            }
            else
            {
                return false;
            }

        }
        else
        {
            return false;
        }
    }

    function check($captcha,$ip,$expiration)
    {
        if($d=$this->delete_old_captcha($expiration))
        {
            // Then see if a captcha exists:
            $sql = 'SELECT COUNT(*) AS count FROM ac_captcha WHERE word = ? AND ip_address = ? AND captcha_time > ?';
            $binds = array($captcha, $ip, $expiration);
            $query = $this->db->query($sql, $binds);
            $row = $query->row();

            if ($row->count == 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }

    }

	function save_captcha($data)
    {
        $query = $this->db->insert_string('ac_captcha', $data);
        return $this->db->query($query);
	}
	
	function delete_old_captcha($expiration)
    {

        return $this->db->where('captcha_time < ', $expiration)
            ->delete('ac_captcha');
	}

	
}