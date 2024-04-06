//TODO: make return page. Add it to routing, It must check stripeApi.checkStatus, then call stripeApi.verify if OK or navigate to StripeRegisterPage if not OK and display toast for error message
export function StripeReturnPage() {
  return <div>Return page</div>;
  // const navigate = useNavigate();
  // const [recreateLink, { data: stripeLink, status, isError: isDisabled }] = stripeApi.useRecreateStripeLinkMutation();
  // const handleClick = () => {
  //   if (!stripeLink) {
  //     return;
  //   }
  //   navigate(stripeLink.stripeAccountLinkUrl);
  // };
  // useEffect(() => {
  //   recreateLink();
  // });
  // const isLoading = status === QueryStatus.pending || status === QueryStatus.uninitialized;
  // return (
  // <AuthContainer>
  /*{ <div className="flex h-full w-10/12 flex-col items-center justify-center gap-10 lg:w-10/12">
        <h2 className="text-center text-3xl font-bold">Stripe registration</h2>
        <p>Stripe account is needed to accept payments. Please, register via button below.</p>
        <Button onClick={handleClick} disabled={isLoading || isDisabled}>
          {isLoading ? (
            <>
              <Loader2 className={cn('mr-2 hidden h-4 w-4 animate-spin')} /> <span>Loading...</span>
            </>
          ) : (
            'Register'
          )}
        </Button>
      </div> }*/
  //   </AuthContainer>
  // );
}
